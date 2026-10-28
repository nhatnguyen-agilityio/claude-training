import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";

const Team = () => {
  const teamParams = useParams<{ teamId: string }>();

  return (
    <div>
      <h1>Team</h1>
      <p>Team ID: {teamParams.teamId}</p>
      <ul>
        <li>
          <NavLink to="/teams/settings/1" style={({isActive}) => isActive ? {color: "red"} : {}}>Team 1</NavLink>
        </li>
        <li>
          <NavLink to="/teams/settings/2" style={({ isActive }) => isActive ? { color: "red" } : {}}>Team 2</NavLink>
        </li>
        <li>
          <NavLink to="/teams/settings/3" style={({ isActive }) => isActive ? { color: "red" } : {}}>Team 3</NavLink>
        </li>
      </ul>
      <Link to="/form">Information Form</Link>
    </div>
  );
}

export default Team;
