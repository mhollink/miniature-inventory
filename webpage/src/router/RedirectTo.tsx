import { FunctionComponent, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type RedirectToProps = {
  path: string;
};

export const RedirectTo: FunctionComponent<RedirectToProps> = ({ path }) => {
  const navigate = useNavigate();

  console.log(path);

  useEffect(() => navigate(path, { replace: true }), [navigate, path]);

  return <></>;
};
