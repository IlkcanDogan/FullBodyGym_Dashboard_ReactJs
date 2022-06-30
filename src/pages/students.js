import React, { useState, useEffect } from 'react';
import { ShowButton, DeleteButton } from '../components/actionbuttons';
import { API_URL, UserStorage, APP_DOMAIN } from '../core/constant';
import axios from 'axios';
import { GlobalDeleteModal } from '../components/modals';
import Error from '../components/error';

function Students() {
    const [table, setTable] = useState({ list: [], _wait: true, _error: '', studentId: 0 });

    const getStudent = () => {
        axios.get(API_URL + '/student', { headers: { token: UserStorage().token } }).then((resp) => {
            if(resp.data.status === 'success') {
                setTable({ ...table, _wait: false, _error: '', list: resp.data.students });
            }
            else {
                setTable({ ...table, _wait: false, _error: 'Bir sorun oluştu, lütfen tekrar deneyin!' });
            }
        }).catch((error) => {
            console.log(error)
            setTable({ ...table, _wait: false, _error: 'Bir sorun oluştu, lütfen tekrar deneyin!' });
        })
    }

    useEffect(() => {
        getStudent();
    }, [])

    const handleDelete = () => {
        window.$('#global-delete-modal').modal('hide')
        setTable({ ...table, _wait: true });

        axios.delete(API_URL + '/student/' + table.studentId, { headers: { token: UserStorage().token } }).then((resp) => {
            getStudent()
        }).catch((error) => {
            console.log(error);
            setTable({ ...table, _wait: false, _error: 'Bir sorun oluştu, lütfen tekrar deneyin!' })
        })
    }

    return (
        <React.Fragment>
            <div className='row'>
                <div className='col-12'>
                    {table._wait ? (
                        <center className="mt-5">
                            <div class="spinner-border text-primary" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                        </center>
                    ) : table._error ? (
                        <center className="mt-5">
                            <Error message={table._error} />
                        </center>
                    ) : (<>
                        <div class="card shadow mb-4">
                            <div class="card-header py-3">
                                <a className='btn btn-primary btn-sm' href='./student/create'>
                                    <i className="fas fa-plus"></i> Kursiyer Hesabı Oluştur
                                </a>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th></th>
                                                <th>Ad</th>
                                                <th>Soyad</th>
                                                <th>E-Posta Adresi</th>
                                                <th>Üyelik Tarihi</th>
                                                <th>Güncelleme Tarihi</th>
                                                <th>İşlemler</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {table.list.map((item, index) => {
                                                return (
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td style={{textAlign: 'center'}}>
                                                            {item.GENDER ? (
                                                                <img src={`./img/gender/${item.GENDER}.png`} width={70} style={{margin: -8}} />
                                                            ): "-" }
                                                        </td>
                                                        <td>{item.FIRSTNAME}</td>
                                                        <td>{item.LASTNAME}</td>
                                                        <td>{item.EMAIL}</td>
                                                        <td>{item.CREATED_DATE}</td>
                                                        <td>{item.LAST_UPDATED || '--'}</td>
                                                        <td>
                                                            <ShowButton onClick={() => window.location.href = APP_DOMAIN + '/student/profile/' + item.USER_ID}/>
                                                            <DeleteButton onClick={() => {
                                                                setTable({...table, studentId: item.USER_ID})
                                                                window.$('#global-delete-modal').modal('show')
                                                            }} />
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>

                                    </table>
                                    {!table.list.length ? (
                                        <center>
                                            <p>Henüz bir kursiyer yok!</p>
                                        </center>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </>)}
                </div>
            </div>
            <GlobalDeleteModal onClick={handleDelete} content='Kursiyer silinsin mi?' />
        </React.Fragment>

    )
}

export default Students;