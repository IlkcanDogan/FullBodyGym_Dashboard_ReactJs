import React, { useState, useEffect } from 'react';
import { API_URL, APP_DOMAIN, UserStorage } from '../core/constant';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { GlobalInfoModal } from '../components/modals';
import Error from '../components/error';

export default function StudentProfile() {
    let { userId } = useParams();
    const genderText = ['', 'Erkek', 'Kadın', 'Erkek Çocuk', 'Kız Çocuk'];

    const [form, setForm] = useState({ firstname: '', lastname: '', email: '', genderText: '', childText: '', age: '', cityName: '', stateName: '', _wait: true, _error: '', variables: [] });

    useEffect(() => {
        axios.get(API_URL + '/student/profile/' + userId, { headers: { token: UserStorage().token } }).then((resp) => {
            if (resp.data.status === 'success') {

                let p = resp.data.profile;
                setForm({
                    _wait: false,
                    firstname: p.FIRSTNAME,
                    lastname: p.LASTNAME,
                    email: p.EMAIL,
                    genderText: genderText[p.GENDER],
                    age: p.AGE,
                    cityName: p.CITY_NAME,
                    stateName: p.STATE_NAME,
                    variables: resp.data.variables
                })
            }
            else {
                setForm({ ...form, _wait: false, _error: 'Bir sorun oluştu, lütfen tekrar deneyin!' })
            }
        }).catch((error) => {
            console.log(error);
            setForm({ ...form, _wait: false, _error: 'Bir sorun oluştu, lütfen tekrar deneyin!' })
        })
    }, [])


    return (
        <div className='row'>
            {form._wait ? (
                <div className='col-12'>
                    <center className="mt-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </center>
                </div>
            ) : form._error ? (
                <div className='col-12'>
                    <center className="mt-5">
                        <Error message={form._error} />
                    </center>
                </div>
            ) : (<>
                <div className='col-12 col-lg-6 mb-5'>
                    <div className="card shadow">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">Beden Ölçüleri</h6>
                        </div >
                        <div className="card-body">
                            <div className="form-row">
                                <div className='col-12'>
                                    <div className='row'>
                                        {form.variables.map((item, index) => {
                                            return (
                                                <div className='col-6 col-sm-4 col-md-4' key={index}>
                                                    <div className='form-group'>
                                                        <label>{item.TITLE}</label>
                                                        <input
                                                            className='form-control'
                                                            disabled
                                                            value={item.VARIABLE_VALUE_START}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-12 col-lg-6 mb-5'>
                    <div className="card shadow">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">Hesap Bilgileri</h6>
                        </div >
                        <div className="card-body">
                            <div className="form-row">
                                <div className='col'>
                                    <label>Adı</label>
                                    <input
                                        className='form-control'
                                        disabled
                                        value={form.firstname}
                                    />
                                </div>
                                <div className='col'>
                                    <label>Soyadı</label>
                                    <input
                                        className='form-control'
                                        disabled
                                        value={form.lastname}
                                    />
                                </div>
                            </div>

                            <div className="form-row mt-3">
                                <div className='col'>
                                    <label>E-Posta Adresi</label>
                                    <input
                                        className='form-control'
                                        disabled
                                        value={form.email}
                                    />
                                </div>
                            </div>

                            <div className="form-row mt-3 mb-3">
                                <div className='col-6'>
                                    <label>Cinsiyet</label>
                                    <input
                                        className='form-control'
                                        disabled
                                        value={form.genderText}
                                    />
                                </div>
                                <div className='col'>
                                    <label>Yaş</label>
                                    <input
                                        className='form-control'
                                        disabled
                                        value={form.age}
                                    />
                                </div>
                            </div>

                            <div className="form-row mt-3">
                                <div className='col'>
                                    <label>Şehir</label>
                                    <input
                                        className='form-control'
                                        disabled
                                        value={form.cityName}
                                    />
                                </div>
                                <div className='col'>
                                    <label>İlçe</label>
                                    <input
                                        className='form-control'
                                        disabled
                                        value={form.stateName}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </>)}

        </div>
    )
}