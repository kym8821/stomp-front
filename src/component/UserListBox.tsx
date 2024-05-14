import "../css/UserListBoxCss.css";

type UserListBoxType = {
  userListTsx: any[];
};

const UserListBox = (props: UserListBoxType) => {
  return <div className="userListBoxContainer">{props.userListTsx}</div>;
};

export default UserListBox;
