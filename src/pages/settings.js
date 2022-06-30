import React, { useState, useEffect } from 'react';
import { API_URL, UserStorage, IsEmail } from '../core/constant';
import Error from '../components/error';
import { GlobalInfoModal } from '../components/modals';
import axios from 'axios';

function Settings() {
    const [provider, setProvider] = useState('');
    const [password, setPassword] = useState({ current: '', new: '', confirm: '', _wait: false, _error: '' });
    const [email, setEmail] = useState({ value: '', _wait: false, _error: '' });
    const [fullname, setFullname] = useState({ firstname: '', lastname: '', _wait: false, _error: '' });

    useEffect(() => {
        setProvider(UserStorage().provider)
        setEmail({ ...email, value: UserStorage().profile.email })
        setFullname({ ...fullname, firstname: UserStorage().profile.firstname, lastname: UserStorage().profile.lastname });
    }, []);

    const handlePasswordUpdate = () => {
        let error;

        if (password.current && password.new && password.confirm) {
            if (password.new.length >= 8) {
                if (password.new !== password.confirm) {
                    error = 'Şifreniz uyuşmuyor, lütfen kontrol edin!';
                }
            }
            else {
                error = 'Yeni şifreniz en az 8 karakter olmalıdır!';
            }
        }
        else {
            error = 'Lütfen boş bırakmayın!'
        }

        if (error) {
            setPassword({ ...password, _error: error })
        }
        else {
            setPassword({ ...password, _wait: true, _error: '' });

            axios.put(API_URL + '/password/update', {
                currentPassword: password.current,
                newPassword: password.new
            }, { headers: { token: UserStorage().token } }).then((resp) => {
                if (resp.data.status === 'success') {
                    window.$('#global-info-modal').modal('show')
                }
                else {
                    error = 'Geçerli şifreniz yanlış!';
                }
            }).catch((error) => {
                console.log(error)
                error = 'Bir sorun oluştu, lütfen tekrar deneyin!'
            }).finally(() => {
                setPassword({ ...password, _wait: false, _error: error });
            })
        }
    }

    const handleProfileUpdate = () => {
        let error;
        if (!fullname.firstname || !fullname.lastname) {
            setFullname({ ...fullname, _wait: false, _error: 'Lütfen boş bırakmayın!' });
        }
        else {
            setFullname({ ...fullname, _wait: true, _error: '' });
            axios.put(API_URL + '/profile', {
                newFirstname: fullname.firstname,
                newLastname: fullname.lastname
            }, { headers: { token: UserStorage().token } }).then((resp) => {
                if (resp.data.status === 'success') {
                    let tmpStorage = {
                        ...UserStorage(),
                        profile: {
                            ...UserStorage().profile,
                            firstname: fullname.firstname,
                            lastname: fullname.lastname
                        }
                    };
                    localStorage.setItem('user', JSON.stringify(tmpStorage));

                    window.$('#global-info-modal').modal('show')
                }
                else {
                    error = 'Bir sorun oluştu. Lütfen daha sonra tekrar deneyin!';
                }
            }).catch((error) => {
                console.log(error);
                error = 'Bir sorun oluştu. Lütfen daha sonra tekrar deneyin!';
            }).finally(() => {
                setFullname({ ...fullname, _wait: false, _error: error });
            })
        }
    }

    const handleEmailUpdate = () => {
        let error;

        if (!IsEmail(email.value)) {
            setEmail({ ...email, _error: 'Lütfen geçerli bir eposta adresi yazın!' });
        }
        else {
            setEmail({ ...email, _wait: true, _error: '' });

            axios.put(API_URL + '/profile/email', {
                newEmail: email.value
            }, { headers: { token: UserStorage().token } }).then((resp) => {
                if (resp.data.status === 'success') {
                    let tmpStorage = {
                        ...UserStorage(),
                        profile: {
                            ...UserStorage().profile,
                            email: email.value
                        }
                    };
                    localStorage.setItem('user', JSON.stringify(tmpStorage));

                    window.$('#global-info-modal').modal('show')
                }
                else if (resp.data.status === 'email-already') {
                    error = 'Bu eposta adresi kullanılıyor!';
                }
                else {
                    error = 'Bir sorun oluştu. Lütfen daha sonra tekrar deneyin!';
                }
            }).catch((error) => {
                console.log(error);
                error = 'Bir sorun oluştu. Lütfen daha sonra tekrar deneyin!';
            }).finally(() => {
                setEmail({ ...email, _wait: false, _error: error });
            })
        }
    }

    return (
        <React.Fragment>
            <div className='row'>
                {provider === 'email' ? (
                    <div className='col-12 col-lg-6 mb-4'>
                        <div className="card shadow">
                            <div className="card-body">
                                <div className="form-group">
                                    <label>Geçerli Şifre</label>
                                    <input
                                        className="form-control"
                                        type="password"
                                        value={password.current}
                                        onChange={(e) => setPassword({ ...password, current: e.target.value, _error: '' })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Yeni Şifre</label>
                                    <input
                                        className="form-control"
                                        type="password"
                                        value={password.new}
                                        onChange={(e) => setPassword({ ...password, new: e.target.value, _error: '' })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Yeni Şifre (Tekrar)</label>
                                    <input
                                        className="form-control"
                                        type="password"
                                        value={password.confirm}
                                        onChange={(e) => setPassword({ ...password, confirm: e.target.value, _error: '' })}
                                    />
                                </div>
                                <Error message={password._error} />
                                <button className='btn btn-primary' onClick={handlePasswordUpdate} disabled={password._wait}>
                                    {password._wait ? 'Lütfen bekleyin...' : 'Şifreyi Değiştir'}
                                </button>
                            </div>
                        </div>
                    </div>

                ) : null}
                <div className='col-12 col-lg-6 mb-4'>
                    <div className="card shadow">
                        <div className="card-body">
                            <div className="form-group">
                                <label>Ad</label>
                                <input
                                    className="form-control"
                                    value={fullname.firstname}
                                    onChange={(e) => setFullname({ ...fullname, firstname: e.target.value, _error: '' })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Soyad</label>
                                <input
                                    className="form-control"
                                    value={fullname.lastname}
                                    onChange={(e) => setFullname({ ...fullname, lastname: e.target.value, _error: '' })}
                                />
                            </div>
                            <Error message={fullname._error} />
                            <button className='btn btn-primary' onClick={handleProfileUpdate} disabled={fullname._wait}>
                                {fullname._wait ? 'Lütfen bekleyin...' : 'Güncelle'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {provider === 'email' ? (
                <div className='row mb-5'>
                    <div className='col-12 col-lg-6'>
                        <div className="card shadow">
                            <div className="card-body">
                                <div className="form-group">
                                    <label>E-posta</label>
                                    <input
                                        className="form-control"
                                        value={email.value}
                                        onChange={(e) => setEmail({ ...email, value: e.target.value, _error: '' })}
                                    />
                                </div>
                                <Error message={email._error} />
                                <button className='btn btn-primary' onClick={handleEmailUpdate} disabled={email._wait}>
                                    {email._wait ? 'Lütfen bekleyin...' : 'Güncelle'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
            <GlobalInfoModal onClick={() => window.$('#global-info-modal').modal('hide')} />
        </React.Fragment>
    )
}

export default Settings;