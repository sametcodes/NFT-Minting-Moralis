import { Container, Navbar, NavbarBrand, NavbarText, Button, Badge, } from 'reactstrap';
import { shortifyAccountAddress } from '@/utils';

import styles from './style.module.css';

const Header = ({ wallet }) => {

    const walletAddress = wallet.address
        ? <>
            <Badge color="primary" style={{marginRight: 5}}>{shortifyAccountAddress(wallet.address)}</Badge>
            <Button onClick={wallet.changeAccount} size="sm">Change Wallet</Button>
        </>
        : <Button size="sm" onClick={wallet.connect}>Connect Wallet</Button>

    return <Navbar className={styles.header}>
        <Container className={styles.headerContainer}>
            <NavbarBrand href="/">VantaMint</NavbarBrand>

            <NavbarText>{walletAddress}</NavbarText>
        </Container>
    </Navbar>

}

const Layout = ({ children, wallet }) => {
    return <div>
        <Header wallet={wallet} />
        <Container>
            {children}
        </Container>
    </div>
}

export default Layout;