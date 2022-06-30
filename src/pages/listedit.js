import React, { useState, useEffect } from 'react';
import { API_URL, APP_DOMAIN, UserStorage } from '../core/constant';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { GlobalInfoModal } from '../components/modals';
import Error from '../components/error';

export default function ListCreate() {
    let { listId } = useParams();

    const [options, setOptions] = useState({ categories: [], variables: [], _wait: true, _error: '' });
    const [form, setForm] = useState({ listName: '', hallName: '', categoryId: 0, listCode: '', genderType: 0, measureType: '', weightType: '', variables: [], _wait: false, _error: '' });

    useEffect(() => {
        axios.get(API_URL + '/list/options', { headers: { token: UserStorage().token } }).then((resp) => {
            if (resp.data.status === 'success') {
                //#region List Data
                axios.get(API_URL + '/list/get/' + listId, { headers: { token: UserStorage().token } }).then((respList) => {
                    if (respList.data.status === 'success') {
                        setOptions({ categories: resp.data.categories, variables: resp.data.variables, _wait: false, _error: '' });

                        let list = respList.data.list;
                        let variables = respList.data.variables;
                        let tmpAllVariables = [];

                        //#region Set Variable Data
                        resp.data.variables.map((item, index) => {
                            let tmp = variables.filter((v) => v.VARIABLE_ID === item.VARIABLE_ID);
                            if (tmp.length) {
                                tmpAllVariables[index] = {
                                    id: tmp[0].VARIABLE_ID,
                                    value: tmp[0].VARIABLE_VALUE
                                };
                            }
                        })
                        //#endregion

                        setForm({
                            ...form,
                            listName: list.LIST_NAME,
                            hallName: list.HALL_NAME,
                            categoryId: list.CATEGORY_ID,
                            listCode: list.LIST_CODE,
                            genderType: list.GENDER,
                            measureType: list.MEASURE_TYPE,
                            weightType: list.WEIGHT_TYPE,
                            variables: tmpAllVariables
                        });

                    }
                    else {
                        setOptions({ ...options, _wait: false, _error: 'Bir sorun oluştu, lütfen tekrar deneyin!' })
                    }
                }).catch((error) => {
                    console.log(error);
                    setOptions({ ...options, _wait: false, _error: 'Bir sorun oluştu, lütfen tekrar deneyin!' })
                })
                //#endregion
            }
            else {
                setOptions({ ...options, _wait: false, _error: 'Bir sorun oluştu, lütfen tekrar deneyin!' })
            }
        }).catch((error) => {
            console.log(error);
            setOptions({ ...options, _wait: false, _error: 'Bir sorun oluştu, lütfen tekrar deneyin!' })
        })
    }, []);


    const handleListUpdate = () => {
        if (form.listName && form.hallName && parseInt(form.categoryId) !== 0 && form.listCode && parseInt(form.genderType) !== 0 && form.measureType !== '' && form.weightType !== '') {
            let dataCount = 0;

            if (form.variables.length) {
                form.variables.map((item, index) => {
                    if (form.variables[index] !== null && form.variables[index].value !== '') {
                        dataCount += 1;
                    }
                })
            }
            if (!dataCount) {
                setForm({ ...form, _error: 'Lütfen en az 1 adet hedef belirleyin!' });
            }
            else {
                setForm({ ...form, _wait: true, _error: '' });

                axios.put(API_URL + '/list', { listId, ...form }, { headers: { token: UserStorage().token } }).then((resp) => {
                    if (resp.data.status === 'success') {
                        window.$('#global-info-modal').modal('show');
                    }
                }).catch((error) => {
                    setForm({ ...form, _wait: false, _error: 'Bir sorun oluştu, lütfen tekrar deneyin!' });
                })
            }
        }
        else {
            setForm({ ...form, _error: 'Lütfen liste özelliklerini boş bırakmayın!' });
        }
    }

    return (
        <div className='row'>
            <div className='col-12'>
                {options._wait ? (
                    <center className="mt-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </center>
                ) : options._error ? (
                    <center className="mt-5">
                        <Error message={options._error} />
                    </center>
                ) : (<>
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">Liste Özellikleri</h6>
                        </div >
                        <div className="card-body">
                           {/*  <div className='row'>
                                <div className='col-12 col-md-6 mb-4'>
                                    <div className="form-row">

                                    </div>
                                </div>
                            </div> */}
                            <div className='row'>
                                <div className='col-12 col-md-6 mb-4'>
                                    <div className="form-row">
                                        <div className='col'>
                                            <label>Liste Adı</label>
                                            <input
                                                className='form-control'
                                                value={form.listName}
                                                onChange={(e) => setForm({ ...form, listName: e.target.value, _error: '' })}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row mt-4">
                                        <div className='col'>
                                            <label>Kategori</label>
                                            <select
                                                className='custom-select'
                                                onChange={(e) => setForm({ ...form, categoryId: e.target.value, _error: '' })}
                                            >
                                                <option value={0}>Seç</option>
                                                {options.categories.map((item, index) => {
                                                    return (
                                                        <option value={`${item.CATEGORY_ID}`} selected={form.categoryId === item.CATEGORY_ID}>{item.CATEGORY_NAME}</option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                        <div className='col'>
                                            <label>Cinsiyet</label>
                                            <select className='custom-select' onChange={(e) => setForm({ ...form, genderType: e.target.value, _error: '' })}>
                                                <option value={0} selected={form.genderType === 0}>Seç</option>
                                                <option value={1} selected={form.genderType === 1}>Erkek</option>
                                                <option value={2} selected={form.genderType === 2}>Kadın</option>
                                                <option value={3} selected={form.genderType === 3}>Erkek Çocuk</option>
                                                <option value={4} selected={form.genderType === 4}>Kız Çocuk</option>
                                                <option value={5} selected={form.genderType === 5}>Hepsi</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12 col-md-6'>
                                    <div className="form-row">
                                        <div className='col-12 col-md-6 mb-3'>
                                            <label>Liste Kodu</label>
                                            <input
                                                className='form-control'
                                                value={form.listCode}
                                                disabled={true}
                                            />
                                        </div>
                                        <div className='col-12 col-md-6'></div>
                                    </div>
                                    <div className="form-row mt-2">
                                        <div className='col'>
                                            <label>Salon Adı</label>
                                            <input
                                                className='form-control'
                                                value={form.hallName}
                                                onChange={(e) => setForm({ ...form, hallName: e.target.value, _error: '' })}
                                            />
                                        </div>
                                        {/* <div className='col'>
                                            <label>Ölçü Birimi</label>
                                            <select className='custom-select' onChange={(e) => setForm({ ...form, measureType: e.target.value, _error: '' })} >
                                                <option value="" selected={form.measureType === ""}>Seç</option>
                                                <option value="CM" selected={form.measureType === "CM"}>CM</option>
                                                <option value="INCH" selected={form.measureType === "INCH"}>İNÇ</option>
                                            </select>
                                        </div>
                                        <div className='col'>
                                            <label>Ağırlık Birimi</label>
                                            <select className='custom-select' onChange={(e) => setForm({ ...form, weightType: e.target.value, _error: '' })}>
                                                <option value="" selected={form.weightType === ""}>Seç</option>
                                                <option value="KG" selected={form.weightType === "KG"}>KG</option>
                                                <option value="LBS" selected={form.weightType === "LBS"}>LBS</option>
                                            </select>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >


                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">Hedefler</h6>
                        </div>
                        <div className="card-body">
                            <div className='row'>
                                {options.variables.map((item, index) => {
                                    return (
                                        <div className='col-6 col-sm-4 col-md-2' key={index}>
                                            <div className='form-group'>
                                                <label>{item.TITLE}</label>
                                                <input
                                                    className='form-control'
                                                    id={`${item.VARIABLE_ID}`}
                                                    type="number"
                                                    min={0}
                                                    value={form.variables[index]?.value}
                                                    onChange={(e) => {
                                                        let tmpAllVariables = form.variables;
                                                        tmpAllVariables[index] = {
                                                            id: item.VARIABLE_ID,
                                                            value: e.target.value
                                                        }
                                                        setForm({ ...form, variables: tmpAllVariables, _error: '' })
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className='row'>
                                <div className='col-12'>
                                    <Error message={form._error} />
                                    <button className='btn btn-success' onClick={handleListUpdate} disabled={form._wait}>
                                        {form._wait ? 'Lütfen bekleyin...' : 'Listeyi Güncelle'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>)}
            </div>
            <GlobalInfoModal onClick={() => {
                window.$('#global-info-modal').modal('hide');
                window.location.href = APP_DOMAIN + '/lists';
            }} content='Bilgiler başarı ile güncellendi!' />
        </div>
    )
}