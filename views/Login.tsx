import React, { FunctionComponent, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import Header from './parts/Header';
import Footer from './parts/Footer';

type Props = {
    ServerProps: ServerPropsType
}

const Login:FunctionComponent<Props> = (props) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formState, setFormState] = useState({
        username: '',
        password: '',
    });

    function handleUsernameInput(e:React.ChangeEvent<HTMLInputElement>) {
        setFormState(oldFormState => {
            return {...oldFormState,
                username: e.target.value
            }
        });
    }

    function handlePasswordInput(e:React.ChangeEvent<HTMLInputElement>) {
        setFormState(oldFormState => {
            return {...oldFormState,
                password: e.target.value
            }
        });
    }

    function handleRegister() {
        setIsLogin(!isLogin);
    }

    async function submit(e:React.MouseEvent) {
        e.preventDefault();

        const response = await fetch(`/user/${isLogin ? 'login' : 'register'}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: formState.username, 
                password: formState.password
            })
        });
        
        if(response.redirected) window.location.href = response.url;
    }

    return <>
        <Header ServerProps={props.ServerProps}></Header>
        <div id='Login' className='Contain'>
            <form>
                <h1>{isLogin ? 'Login' : 'Register'}</h1>
                <input className='LoginField' type="text" placeholder='Username' value={formState.username} onChange={handleUsernameInput} />
                <input className='LoginField' type="text" placeholder='Password' value={formState.password} onChange={handlePasswordInput} />
                <div className='SubButtons'>
                    <p className='LoginLink' onClick={handleRegister}>{isLogin ? 'register' : 'login'}</p>
                </div>
                <button onClick={submit}>Submit</button>
            </form>
        </div>
        <Footer></Footer>
    </>
}

if (typeof window !== 'undefined') {
    hydrateRoot(document.getElementById('root') as HTMLElement, <Login ServerProps={window.ServerProps}/>);
}

export default Login;