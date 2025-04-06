import { PropsWithChildren } from 'react'
import { NavLink } from 'react-router'

export default () => (
    <header>
        <nav>
            <NavigationLink to="/">Playground</NavigationLink>
            <NavigationLink to="/history">Playground History</NavigationLink>
            <NavigationLink to="/about">About</NavigationLink>
        </nav>
    </header>
)

/*TODO: Style active links differently*/
const NavigationLink = ({
    to,
    children,
}: PropsWithChildren<{ to: string }>) => (
    <NavLink to={to} className={({ isActive }) => (isActive ? 'active' : '')}>
        {children}
    </NavLink>
)
