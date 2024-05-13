import { User } from '../util/Users';
import '../css/UserBoxCss.css';

type UserBoxType = {
  user: User;
};

const UserBox = (props: UserBoxType) => {
  return (
    <div className="userbox">
      <div>{props.user.username}</div>
    </div>
  );
};

export default UserBox;
