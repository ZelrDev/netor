import { Anchor, Breadcrumbs as BC } from "@mantine/core";
import { Link } from "@remix-run/react";
export const Breadcrumbs = (props: {
  items: { title: string; href?: string; onClick?: any }[];
}) => {
  const items = props.items.map((item, index) =>
    item.href ? (
      <Anchor to={item.href} component={Link} key={index}>
        {item.title}
      </Anchor>
    ) : item.onClick ? (
      <Anchor onClick={item.onClick} key={index}>
        {item.title}
      </Anchor>
    ) : (
      <span key={index}>{item.title}</span>
    )
  );
  return <BC pb="sm">{items}</BC>;
};
