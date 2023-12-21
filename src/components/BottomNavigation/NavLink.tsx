import { Message } from "@app/i18n";
import { Link, Screen, navigation } from "@app/stores";
import { JSX } from "solid-js";

export type NavLinkProps = {
  screen: Screen;
  icon: JSX.Element;
}

export function NavLink(props: NavLinkProps) {
  return (
    <Link
      href={navigation.getNavLinkPath(props.screen)}
      screen="home"
      classList={{ "nav-link ": true, asctive: navigation.isScreenActive(props.screen) }}
    >
      {props.icon}
      <span class="sr-only">
        <Message>{`BottomNavigation.${props.screen}`}</Message>
      </span>
    </Link>
  )
}