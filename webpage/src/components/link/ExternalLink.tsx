import { FunctionComponent, PropsWithChildren } from "react";
import Link from "@mui/material/Link";
import { BiLinkExternal } from "react-icons/bi";

type ExternalLinkProps = {
  href: string;
};

export const ExternalLink: FunctionComponent<
  PropsWithChildren<ExternalLinkProps>
> = ({ href, children }) => {
  return (
    <Link
      target="_blank"
      color="primary"
      rel="noopener noreferrer"
      href={href}
      sx={{
        display: "inline-flex",
      }}
    >
      {children}
      <BiLinkExternal style={{ fontSize: ".7rem" }} />
    </Link>
  );
};
