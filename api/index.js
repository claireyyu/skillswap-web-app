import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";

const PORT = parseInt(process.env.PORT, 10) || 8080;

// this is a middleware that will validate the access token sent by the client
const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: "RS256",
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// this is a public endpoint because it doesn't have the requireAuth middleware
app.get("/ping", (req, res) => {
  res.send("pong");
});

// Endpoints for User model
// Verify the user in database
app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];
  const name = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/name`];

  let user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (user) {
    res.json(user);
  } else {
    // If user does not exit, create a new user
    const newUser = await prisma.user.create({
      data: {
        email,
        auth0Id,
        name
      }
    });
    res.json(newUser);
  }
});

// Get information of user
app.get("/users", requireAuth, async(req, res) => {
  const auth0Id = req.auth.payload.sub;

  const user = await prisma.user.findUnique({
    where: { auth0Id },
    include: { skills: true, learnerMeetings: true, tutorMeetings: true },
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({message: "User not found"});
  }
})

// Update user information
app.put("/users", requireAuth, async(req, res) => {
  const auth0Id = req.auth.payload.sub;
  const {name, bio, availableTime} = req.body;

  const user = await prisma.user.findUnique({
    where: { auth0Id },
  });

  if (user) {
    const updatedUser = await prisma.user.update({
      where: { auth0Id },
      data: { name, bio, availableTime },
    });
    res.json(updatedUser);
  } else {
    res.status(404).json({message: "User not found"});
  }
})

// Delete User
app.delete("/users", requireAuth, async(req, res) => {
  const auth0Id = req.auth.payload.sub;

  const user = await prisma.user.findUnique({
    where: { auth0Id },
  });
  
  if (user) {
    await prisma.user.delete({
      where: { auth0Id }
    });
    res.json({message: "User deleted"});
  } else {
    res.status(404).json({message: "User not found"});
  }
})

// Endpoints for Skill model
// Create a new Skill post
app.post("/skills", requireAuth, async(req, res) => {
  const auth0Id = req.auth.payload.sub;
  const {title, description} = req.body;

  const user = await prisma.user.findUnique({
    where: { auth0Id },
  });

  if (user) {
    const newSkill = await prisma.skill.create({
      data: {
        title,
        description,
        userId: user.id
      }
    });
    res.json(newSkill);
  } else {
    res.status(404).json({message: "User not found"});
  }
});

// Get all public Skill posts
app.get("/skills/public", async(req, res) => {
  const skills = await prisma.skill.findMany({
    include: {
      user: true,
    },
  });

  if (skills) {
    res.json(skills);
  } else {
    res.status(404).json({message: "Skills not found"});
  }
});

// Get all Skill posts of a user
app.get("/skills", requireAuth, async(req, res) => {
  const auth0Id = req.auth.payload.sub;

  const user = await prisma.user.findUnique({
    where: { auth0Id },
  });

  const skills = await prisma.skill.findMany({
    where: { userId: user.id },
    include: {
      user: true,
    },
  });

  if (skills) {
    res.json(skills);
  } else {
    res.status(404).json({message: "Skills not found"});
  }
});

// Get a Skill post by id
app.get("/skills/:id", requireAuth, async(req, res) => {
  const id = parseInt(req.params.id);

  const skill = await prisma.skill.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });

  if (skill) {
    res.json(skill);
  } else {
    res.status(404).json({message: "Skill not found"});
  }
});

// Get a public Skill post by id
app.get("/skills/public/:id", async(req, res) => {
  const id = parseInt(req.params.id);

  const skill = await prisma.skill.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });

  if (skill) {
    res.json(skill);
  } else {
    res.status(404).json({message: "Skill not found"});
  }
});

// Update a Skill post by id
app.put("/skills/:id", requireAuth, async(req, res) => {
  const id = parseInt(req.params.id);
  const {title, description} = req.body;

  const updatedSkill = await prisma.skill.update({
    where: { id },
    data: { title, description },
  });

  if (updatedSkill) {
    res.json(updatedSkill);
  } else {
    res.status(404).json({message: "Skill not found"});
  }
});

// Delete a Skill post by id
app.delete("/skills/:id", requireAuth, async(req, res) => {
  const id = parseInt(req.params.id);

  const deletedSkill = await prisma.skill.delete({
    where: { id },
  });

  if (deletedSkill) {
    res.json({message: "Skill deleted"});
  } else {
    res.status(404).json({message: "Skill not found"});
  }
});

// Endpoints for Meeting model
// Create a New Meeting
app.post("/meetings", requireAuth, async (req, res) => {
  const { learnerUserId, tutorUserId, meetingTime, title } = req.body;

  try {
    const newMeeting = await prisma.meeting.create({
      data: {
        learnerUserId,
        tutorUserId,
        meetingTime: new Date(meetingTime),
        title,
      },
    });
    res.json(newMeeting);
  } catch (error) {
    res.status(500).json({ message: "Error creating meeting", error });
  }
});

// Get all Meetings
app.get("/meetings", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  try {
    const user = await prisma.user.findUnique({
      where: { auth0Id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const meetings = await prisma.meeting.findMany({
      where: {
        OR: [
          { learnerUserId: user.id },
          { tutorUserId: user.id },
        ],
      },
    });

    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving meetings", error });
  }
});

// Get a Meeting by id
app.get("/meetings/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const meeting = await prisma.meeting.findUnique({
      where: { id },
    });

    if (meeting) {
      res.json(meeting);
    } else {
      res.status(404).json({ message: "Meeting not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving meeting", error });
  }
});

// Update a Meeting by id
app.put("/meetings/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  const { meetingTime, title } = req.body;

  try {
    const updatedMeeting = await prisma.meeting.update({
      where: { id },
      data: {
        meetingTime: new Date(meetingTime),
        title,
      },
    });

    res.json(updatedMeeting);
  } catch (error) {
    res.status(500).json({ message: "Error updating meeting", error });
  }
});

// Delete a Meeting by id
app.delete("/meetings/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.meeting.delete({
      where: { id },
    });

    res.json({ message: "Meeting deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting meeting", error });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} 🎉 🚀`);
});
