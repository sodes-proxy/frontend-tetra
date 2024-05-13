import React from 'react';
//import Button from './Button';
import { useState, useEffect } from 'react';
import './Admin.css';
import '../agenda/FutureEvents.css';
import { getList } from '../helpers/options';
import { openToast } from '../helpers/toast';
import { handleChange, handleSubmit } from '../helpers/handles';


const Admin = () => {
    const [formData, setFormData] = useState({
        name : '',
        role: '',
        email: ''
    });
    const [users, setUsers] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [idEdit, setIdEdit] = useState('');
    const onShow =  () => { setShowToast(true) };
    const onClose =  () => { setShowToast(false) };

    const roles = {'admin':'Administrador', 'secretary':'Recepcionista',
        'inventary':'Inventario', 'finance':'Financiero'
    }

    const roles_list = ['secretary', 'inventary', 'finance', 'admin'];

    const handleEdit = (e) => {
        handleSubmit(e, 'http://127.0.0.1:8000/editarUsuario', {method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)}, formData, [], onClose, onShow, ()=>{})
    };

    useEffect(() => {
        const errorMsg = 'Hubo un problema al querer obtener los usuarios';
        getList('http://127.0.0.1:8000/users', {}, setUsers, null, 'users', null, 
        () => openToast(false, errorMsg, 2000, onClose, onShow))
    }, []);

    return (
        <div className="admin-container">
            <img src="/logo-trento.jpeg" alt="Business Logo" className="login-logo" />
            <table className="future-events-table">
                <thead>
                    <tr>{['Nombre', 'Correo', 'Rol', 'Acciones'].map((header, index) => {
                        return <th key={index}>{header}</th>;
                    })}</tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr><td colSpan="4">No hay usuarios.</td></tr>
                    ) : (
                        users.map(user => (
                            <tr key={user._id}>
                                { idEdit === user.email ? (<React.Fragment>
                                    <td><input type='text' name='name' value={formData.name} onChange={(e)=>handleChange(e, setFormData)}/></td>
                                    <td><input type='text' name='email' value={formData.email} onChange={(e)=>handleChange(e, setFormData)}/></td>
                                    <td><select name="role" value={formData.role} onChange={(e)=>handleChange(e, setFormData)}>
                                        {roles_list.map((option, index) => (
                                            <option key={index} value={option}>{roles[option]}</option>
                                        ))}
                                    </select></td>
                                    </React.Fragment>):(
                                    [user.name, user.email, roles[user.role]].map((value, index) => {
                                        return <td key={index}>{value}</td>;
                                    })   
                                )}
                                <td>
                                {idEdit === user.email ? (
                                    <React.Fragment>
                                        <button className="payment" onClick={(e)=>handleEdit(e)} >Confirmar</button>
                                        <button className="delete" onClick={()=>setIdEdit('')}>Cancelar</button>
                                    </React.Fragment>
                                    
                                ):(<React.Fragment> 
                                    <button className="edit" onClick={()=> { setIdEdit(user.email); setFormData({'email':user.email, 'name':user.name, 'role':user.role})}} >Editar</button>  
                                    <button className="delete" >Eliminar</button>
                                </React.Fragment> 
                                )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Admin;