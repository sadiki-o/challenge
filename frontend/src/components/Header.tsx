import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { FC } from "react";

interface HeaderProps {
  userEmail: string;
  onSignOut: () => void;
}

const Header: FC<HeaderProps> = ({ userEmail, onSignOut }) => {
  return (
    <AppBar
      position="static"
      sx={{
        marginBottom: 5,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">User: {userEmail}</Typography>
        <Button color="inherit" variant="outlined" onClick={onSignOut}>
          Sign Out
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
