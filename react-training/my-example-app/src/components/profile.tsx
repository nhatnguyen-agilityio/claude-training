import ProfileInterface from "../interfaces/profile";
import Avatar from "./avatar";
import Card from "./card";

// const user = {
//   name: 'John Doe',
//   imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
//   imageSize: 90,
// }
// const isLoggedIn = true;

const Profile = (props: ProfileInterface) => {
  return (
    <Card>
      <Avatar {...props} />
    </Card>
  );
}

export default Profile;
