import React, { useState, useEffect } from "react";
import { Typography, Box, Button, Divider } from "@mui/material";
import { toast } from "react-toastify";
import "./group.css"; // Import the CSS file
import SelectedPlayers from "./selectPlayers";

interface Member {
  userId: string;
  username: string;
  teamName: string;
}

interface Group {
  groupCode: string;
  groupName: string;
  members: Member[];
}

const GroupList: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [memberPoints, setMemberPoints] = useState<{ [key: string]: number }>(
    {}
  );

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const userId = localStorage.getItem("userId");
        console.log("User ID:", userId); // Debugging: Check if userId is correctly retrieved

        if (!userId) {
          toast.error("User not logged in. Please log in to view groups.");
          return;
        }

        const response = await fetch(
          `http://localhost:4001/api/groups/user/${userId}`
        );
        console.log("Response Status:", response.status); // Debugging: Check the response status

        if (response.ok) {
          const data = await response.json();
          console.log("Response Data:", data); // Debugging: Check the response data

          if (data.success) {
            setGroups(data.groups);
            // Fetch points for each member from the API
            const points: { [key: string]: number } = {};
            for (const group of data.groups) {
              for (const member of group.members) {
                try {
                  const playerResponse = await fetch(
                    `http://localhost:4001/api/players/${member.userId}`
                  );
                  if (playerResponse.ok) {
                    const playerData = await playerResponse.json();
                    const totalPoints = playerData.reduce(
                      (sum: number, player: { totalpoints: number }) =>
                        sum + player.totalpoints,
                      0
                    );
                    points[member.userId] = totalPoints;
                  } else {
                    console.error(
                      `Failed to fetch players for ${member.userId}`
                    );
                  }
                } catch (error) {
                  console.error(
                    `Error fetching players for ${member.userId}:`,
                    error
                  );
                }
              }
            }
            setMemberPoints(points);
          } else {
            toast.error("Failed to load groups.");
          }
        } else {
          toast.error(`Failed to load groups: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
        toast.error("Failed to load groups.");
      }
    };

    fetchGroups();
  }, []);

  const handleGroupClick = (groupCode: string, groupName: string) => {
    const group = groups.find((g) => g.groupCode === groupCode);
    if (group) {
      setSelectedGroup(group);
      setSelectedUserId(null); // Reset selected user ID
    }
  };

  const handleMemberClick = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleBack = () => {
    setSelectedUserId(null); // Go back to the group list view
  };

  if (selectedUserId) {
    return <SelectedPlayers userId={selectedUserId} onBack={handleBack} />;
  }

  // Sort members by their total points in descending order
  const sortedMembers =
    selectedGroup?.members
      .map((member) => ({
        ...member,
        points: memberPoints[member.userId] || 0,
      }))
      .sort((a, b) => b.points - a.points) || [];

  return (
    <Box className="group-list-container">
      <Typography variant="h4" className="group-title">
        Your Groups
      </Typography>
      {selectedGroup ? (
        <>
          <Typography variant="h5" className="group-details">
            Members of Group: {selectedGroup.groupName} (Code:{" "}
            {selectedGroup.groupCode})
          </Typography>
          <Divider className="group-divider" />
          <table className="group-member-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Team Name</th>
                <th>Total Points</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedMembers.map((member, index) => (
                <tr key={index}>
                  <td>{member.username || "N/A"}</td>
                  <td>{member.teamName || "N/A"}</td>
                  <td>{member.points}</td>
                  <td>
                    <Button
                      variant="outlined"
                      onClick={() => handleMemberClick(member.userId)}
                    >
                      View Players
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button
            variant="outlined"
            onClick={() => setSelectedGroup(null)}
            className="back-button"
          >
            Back to Group List
          </Button>
        </>
      ) : (
        <ul className="group-list">
          {groups.map((group) => (
            <li
              style={{
                backgroundColor: "aliceblue",
                listStyle: "none",
                cursor: "pointer",
                padding: "12px",
                marginBottom: "12px",
              }}
              key={group.groupCode}
              onClick={() => handleGroupClick(group.groupCode, group.groupName)}
              className="group-item"
            >
              {group.groupName}
            </li>
          ))}
        </ul>
      )}
    </Box>
  );
};

export default GroupList;
