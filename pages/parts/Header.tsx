import React, { FunctionComponent } from 'react';

type Props = {
    ServerProps: ServerPropsType
}

const Header:FunctionComponent<Props>= (props) => {
    return (
        <header id="Header">
            <div className='Contain'>
                <a href='/'>Home</a>
                <nav>
                    {props.ServerProps?.isAdmin ? <a href='/user/logout'>Log Out</a> : <a href='/user/login'>Login</a> }
                </nav>
            </div>
        </header>
    );
}

export default Header;