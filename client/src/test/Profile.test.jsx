import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import Profile from '../components/Profile';
import useUser from '../hooks/user/useUser';
import useSkills from '../hooks/skills/useSkills';
import useMeetings from '../hooks/meetings/useMeetings';

jest.mock('../hooks/user/useUser');
jest.mock('../hooks/skills/useSkills');
jest.mock('../hooks/meetings/useMeetings');

describe('Profile Component', () => {
  const mockUser = {
    name: 'Claire',
    email: 'claireyuca@outlook.com',
    skills: [
      { id: 1, title: 'Skill 1', description: 'Description 1' },
      { id: 2, title: 'Skill 2', description: 'Description 2' }
    ],
    availableTime: 'Friday',
    bio: 'Bio here'
  };

  const mockSkills = [
    { id: 1, title: 'Skill 1', description: 'Description 1' },
    { id: 2, title: 'Skill 2', description: 'Description 2' }
    ];

  const mockMeetings = [
    { id: 1, title: 'Meeting 1', meetingTime: '2023-06-26T10:00:00Z' },
  ];

  let mockUpdateUser;
  let mockUpdateSkill;
  let mockDeleteSkill;
  let mockUpdateMeeting;
  let mockDeleteMeeting;

  beforeEach(() => {
    mockUpdateUser = jest.fn().mockResolvedValue({});
    mockUpdateSkill = jest.fn().mockResolvedValue({});
    mockDeleteSkill = jest.fn();
    mockUpdateMeeting = jest.fn().mockResolvedValue({});
    mockDeleteMeeting = jest.fn();

    useUser.mockReturnValue({
      user: mockUser,
      loadingUser: false,
      errorUser: null,
      updateUser: mockUpdateUser
    });

    useSkills.mockReturnValue({
      skills: mockSkills,
      loadingSkills: false,
      errorSkills: null,
      updateSkill: mockUpdateSkill,
      deleteSkill: mockDeleteSkill
    });

    useMeetings.mockReturnValue({
      meetings: mockMeetings,
      loadingMeetings: false,
      errorMeetings: null,
      updateMeeting: mockUpdateMeeting,
      deleteMeeting: mockDeleteMeeting
    });
  });

  afterEach(cleanup);

  test('renders user correctly', () => {
    render(<Profile />);

    expect(screen.getByText('Claire')).toBeInTheDocument();
    expect(screen.getByText('claireyuca@outlook.com')).toBeInTheDocument();
    expect(screen.getByText('Friday')).toBeInTheDocument();
    expect(screen.getByText('Bio here')).toBeInTheDocument();
  });

  test('shows save and cancel buttons when edit button is clicked', () => {
    render(<Profile />);

    fireEvent.click(screen.getByText('Edit Profile'));

    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('edits user details and saves successfully', async () => {
    render(<Profile />);

    fireEvent.click(screen.getByText('Edit Profile'));

    const nameInput = screen.getByPlaceholderText('User Name');
    fireEvent.change(nameInput, { target: { value: 'Claire Edited' } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({
        name: 'Claire Edited',
        availableTime: 'Friday',
        bio: 'Bio here'
      });
    });

    useUser.mockReturnValue({
        user: { ...mockUser, name: 'Claire Edited' },
        loadingUser: false,
        errorUser: null,
        updateUser: mockUpdateUser
      });

    await waitFor(() => {
      expect(screen.queryByPlaceholderText('User Name')).not.toBeInTheDocument();
      expect(screen.getByText('Claire Edited')).toBeInTheDocument();
    });
  });

  test('edits skill details and saves successfully', async () => {
    render(<Profile />);

    fireEvent.click(screen.getAllByText('Edit')[0]);

    const titleInput = screen.getByPlaceholderText('Skill Name');
    fireEvent.change(titleInput, { target: { value: 'Skill Edited' } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockUpdateSkill).toHaveBeenCalledWith(1, {
        id: 1,
        title: 'Skill Edited',
        description: 'Description 1'
      });
    });

    useSkills.mockReturnValue({
      skills: [
        { id: 1, title: 'Skill Edited', description: 'Description 1' },
        { id: 2, title: 'Skill 2', description: 'Description 2' }
      ],
      loadingSkills: false,
      errorSkills: null,
      updateSkill: mockUpdateSkill,
      deleteSkill: mockDeleteSkill
    });

    cleanup();
    render(<Profile />);

    await waitFor(() => {
        expect(screen.queryByPlaceholderText('Skill Name')).not.toBeInTheDocument();
    });
  });

  test('edits meeting details and saves successfully', async () => {
    render(<Profile />);
  
    fireEvent.click(screen.getAllByText('Edit')[2]);
  
    const titleInput = screen.getByPlaceholderText('Meeting Title');
    fireEvent.change(titleInput, { target: { value: 'Meeting Edited' } });
  
    fireEvent.click(screen.getByText('Save'));
  
    await waitFor(() => {
      expect(mockUpdateMeeting).toHaveBeenCalledWith(1, {
        title: 'Meeting Edited',
        meetingTime: '2023-06-26T10:00:00Z'
      });
    });
  
    useMeetings.mockReturnValue({
      meetings: [
        { id: 1, title: 'Meeting Edited', meetingTime: '2023-06-26T10:00:00Z' },
        { id: 2, title: 'Meeting 2', meetingTime: '2023-06-27T10:00:00Z' }
      ],
      loadingMeetings: false,
      errorMeetings: null,
      updateMeeting: mockUpdateMeeting,
      deleteMeeting: mockDeleteMeeting
    });
  
    cleanup();
  
    render(<Profile />);
  
    await waitFor(() => {
      expect(screen.getByText('Meeting Edited')).toBeInTheDocument();
    });
  });

  test('deletes a skill successfully', async () => {
    render(<Profile />);

    fireEvent.click(screen.getAllByText('Delete')[0]);

    await waitFor(() => {
      expect(mockDeleteSkill).toHaveBeenCalledWith(1);
    });
  });


  test('deletes a meeting successfully', async () => {
    render(<Profile />);

    fireEvent.click(screen.getAllByText('Delete')[2]);

    await waitFor(() => {
      expect(mockDeleteMeeting).toHaveBeenCalledWith(1);
    });
  });
});
