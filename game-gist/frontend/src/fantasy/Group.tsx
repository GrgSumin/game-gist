import React from "react";

interface GroupMember {
  userId: string;
  username: string;
  teamName: string;
  totalPoints: number;
}

interface GroupProps {
  groupMembers: GroupMember[];
}

const Group: React.FC<GroupProps> = ({ groupMembers }) => {
  // Sort members by totalPoints
  const sortedMembers = [...groupMembers].sort(
    (a, b) => b.totalPoints - a.totalPoints
  );

  return (
    <div>
      <h2>Group Members</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Team Name</th>
            <th>Total Points</th>
          </tr>
        </thead>
        <tbody>
          {sortedMembers.map((member) => (
            <tr key={member.userId}>
              <td>{member.username}</td>
              <td>{member.teamName}</td>
              <td>{member.totalPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Group;
