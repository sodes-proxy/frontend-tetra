import React from 'react';
//import Button from './Button';
import { useState, useEffect } from 'react';
import './Admin.css';
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
    const [password,setPassword] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
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
        body: JSON.stringify(formData)}, formData, [], onClose, onShow, ()=>{updateUser(formData.email, formData)})
        setIdEdit('');
    };

    const handleNewUser = (e) => {
        const newUser = {'name':formData.name, 'email':formData.email,'role':formData.role};
        handleSubmit(e, 'http://127.0.0.1:8000/register', {method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...formData, 'password':password})}, formData, [], onClose, onShow, ()=>{setUsers(prevUsers => [...prevUsers, newUser])})
        setIsCreating(false)
    };

    const updateUser = (email, updatedUserInfo) => {
        setUsers(prevUsers => prevUsers.map(user => {
          if (user.email === email) {
            // If the user ID matches the ID of the user you want to update,
            // merge the updatedUserInfo into the user object
            return { ...user, ...updatedUserInfo };
          } else {
            // If the user ID doesn't match, return the original user object
            return user;
          }
        }));
      };


    useEffect(() => {
        const errorMsg = 'Hubo un problema al querer obtener los usuarios';
        getList('http://127.0.0.1:8000/users', {}, setUsers, null, 'users', null, 
        () => openToast(false, errorMsg, 2000, onClose, onShow))
    }, []);

    return (
        <div className="view-event-container">
            <img src="/logo-trento.jpeg" alt="Business Logo" className="login-logo" />
            <div className='table-wrapper'>
            <table className="future-events-table">
                <thead>
                    <tr>{['Nombre', 'Correo', 'Rol', 'Clave', 'Acciones'].map((header, index) => {
                        return <th key={index}>{header}</th>;
                    })}</tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr><td colSpan="4">No hay usuarios.</td></tr>
                    ) : (
                        users.map(user => (
                            <React.Fragment>
                                <tr key={user._id}>
                                { idEdit === user.email ? (<React.Fragment>
                                    <td><input type='text' name='name' value={formData.name} onChange={(e)=>handleChange(e, setFormData)}/></td>
                                    <td>{formData.email}</td>
                                    <td><select name="role" value={formData.role} onChange={(e)=>handleChange(e, setFormData)}>
                                        {roles_list.map((option, index) => (
                                            <option key={index} value={option}>{roles[option]}</option>
                                        ))}
                                    </select></td>
                                    <td>*********</td>
                                    </React.Fragment>):(
                                    [user.name, user.email, roles[user.role], '*********'].map((value, index) => {
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
                                    <button className="edit" onClick={()=> {setIsCreating(false); setIdEdit(user.email); setFormData({'email':user.email, 'name':user.name, 'role':user.role})}} >Editar</button>  
                                    <button className="delete" >Eliminar</button>
                                </React.Fragment> 
                                )}
                                
                                </td>
                            </tr>  
                            </React.Fragment>
                            
                        ))
                    )}
                    {isCreating === true ? (
                        <tr>
                            <td><input type='text' name='name' value={formData.name} onChange={(e)=>handleChange(e, setFormData)}/></td>
                            <td><input type='text' name='email' value={formData.email} onChange={(e)=>handleChange(e, setFormData)}/></td>
                            <td><select name="role" value={formData.role} onChange={(e)=>handleChange(e, setFormData)}>
                            {roles_list.map((option, index) => (
                                <option key={index} value={option}>{roles[option]}</option>
                            ))}
                        </select></td>
                            <td><input type='password' name='password' onChange={(e)=>setPassword(e.target.value)}/></td>
                            <td><button className="payment" onClick={(e)=> {handleNewUser(e)}} >Confirmar</button>  
                        <button className="delete" onClick={()=> {setIsCreating(false)}} >Cancelar</button></td>
                        </tr>):null}
                </tbody>
            </table>
            </div>
            {isCreating === true ? (null):(<button id='addUser' className="payment"  onClick={()=> {setIdEdit(''); setIsCreating(true); setFormData({'email':'', 'name':'', 'role':roles_list[0]})}}>Agregar usuario</button>)}
            
        </div>
    );
};

export default Admin;