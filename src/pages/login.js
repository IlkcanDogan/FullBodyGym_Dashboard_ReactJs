import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { API_URL, IsEmail, FACEBOOK_APP_ID } from '../core/constant';
import Error from '../components/error';
import axios from 'axios';

function Login() {
    let history = useHistory();
    const urlParams = new URLSearchParams(window.location.search);
    
    useEffect(() => {
        let token = urlParams.get('token'), firstname = urlParams.get('firstname'), lastname = urlParams.get('lastname'), provider = urlParams.get('provider');
        if(token && firstname && lastname && provider) {
            localStorage.setItem('user', JSON.stringify({ profile: {firstname, lastname}, token, provider }));
            history.push('/students');
        }
    }, [])

    const [form, setForm] = useState({ email: '', password: '', _wait: false, _error: '' });
    const handleLogin = () => {
        let error;

        if (!IsEmail(form.email) || form.password.length < 8) {
            error = 'E-posta adresiniz veya şifreniz yanlış!';
        }

        if (error) {
            setForm({ ...form, _error: error });
        }
        else {
            setForm({ ...form, _wait: true, _error: '' });
            axios.post(API_URL + '/login', { ...form }).then((resp) => {
                if (resp.data.status === 'success') {
                    localStorage.setItem('user', JSON.stringify({ profile: resp.data.profile, token: resp.data.token, provider: resp.data.provider }));
                    history.push('/students');
                }
                else {
                    error = 'E-posta adresiniz veya şifreniz yanlış!';
                }
            }).catch((err) => {
                console.log(err.message);
                error = 'Bir sorun oluştu. Lütfen daha sonra tekrar deneyin!';
            }).finally(() => {
                setForm({ ...form, _wait: false, _error: error });
            })
        }
    }

    const [facebook, setFacebook] = useState({ _wait: false, _error: '' });
    const handleLoginWithFacebook = (response) => {
        if (response.userID) {
            let error;
            setFacebook({ ...facebook, _wait: true });

            axios.post(API_URL + '/login/with/facebook', {
                accessToken: response.accessToken,
                userId: response.userID
            }).then((resp) => {
                if (resp.data.status === 'success') {
                    localStorage.setItem('user', JSON.stringify({ profile: resp.data.profile, token: resp.data.token, provider: resp.data.provider }));
                    history.push('/students');
                }
                else {
                    error = 'Bir sorun oluştu. Lütfen daha sonra tekrar deneyin!';
                }
            }).catch((err) => {
                console.log(err);
                error = 'Bir sorun oluştu. Lütfen daha sonra tekrar deneyin!';
            }).finally(() => {
                setFacebook({ ...facebook, _wait: false, _error: error });
            })
        }
    }

    return (
        <div className="bg-gradient-primary" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
            <div className="container" style={{ backgroundColor: '#4657B7' }}>
                <div className="row justify-content-center">
                    <div className="col-xl-10 col-lg-12 col-md-9">
                        <div className="card o-hidden border-0 shadow-lg my-5">
                            <div className="card-body p-0">
                                <div className="row">
                                    <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                                    <div className="col-lg-6">
                                        <div className="p-5">
                                            <div className="text-center">
                                                <h1 className="h4 text-gray-900 mb-4">Antrenör Paneli</h1>
                                            </div>
                                            <form className="user">
                                                <div className="form-group">
                                                    <input
                                                        className="form-control form-control-user"
                                                        placeholder="E-posta Adresi"
                                                        value={form.email}
                                                        onChange={(e) => setForm({ ...form, email: e.target.value, _error: '' })}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <input
                                                        className="form-control form-control-user"
                                                        placeholder="Şifre"
                                                        type="password"
                                                        value={form.password}
                                                        onChange={(e) => setForm({ ...form, password: e.target.value, _error: '' })}
                                                    />
                                                </div>
                                                <Error message={form._error} />
                                                <button onClick={handleLogin} type="button" className="btn btn-primary btn-user btn-block" disabled={form._wait}>
                                                    {form._wait ? 'Lütfen bekleyin...' : 'Giriş Yap'}
                                                </button>
                                                <hr />
                                                <center>
                                                    <div class="g_id_signin mb-3" data-type="standard"></div>
                                                </center>
                                                <FacebookLogin
                                                    appId={FACEBOOK_APP_ID}
                                                    callback={handleLoginWithFacebook}
                                                    isMobile={false}
                                                    render={renderProps => (
                                                        <button onClick={renderProps.onClick} type="button" className="btn btn-facebook btn-user btn-block" disabled={facebook._wait}>
                                                            {facebook._wait ? 'Lütfen bekleyin...' : <>
                                                                <i className="fab fa-facebook-f fa-fw"></i> Facebook ile giriş yap
                                                            </>}
                                                        </button>
                                                    )}
                                                />
                                            </form>
                                            <hr />
                                            <div className="text-center">
                                                <Link to="/password/reset" className="small">Şifreni mi unuttun?</Link>
                                            </div>
                                            <div className="text-center">
                                                <Link to="/register" className="small">Hesap Oluştur</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login