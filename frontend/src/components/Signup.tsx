import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { Local } from '../environment/env';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import * as Yup from 'yup';
import '../Styling/Signup.css';
import logo from '../Assets/svg_logo.svg';

const Signup: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const addUser = async (formData: any) => {
        try {
            const response = await api.post(`${Local.CREATE_USER}`, formData);
            localStorage.setItem("email", formData.email); // Store user email for session
            toast.success(response.data.message); // Show success message
            return response;
        } catch (err: any) {
            toast.error(err?.response?.data?.message); // Show error message
            throw err;
        }
    };

    const validationSchema = Yup.object().shape({
        firstname: Yup.string().required('First name is required'),
        lastname: Yup.string().required('Last name is required'),
        email: Yup.string().email("Invalid Email").required("Email is required"),
        password: Yup.string().min(8, "Password must be at least 8 characters long").required("Password is required")
            .matches(/[a-z]/, "Password must contain at least one lowercase letter")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/\d/, "Password must contain at least one number")
            .matches(/[`~!@#$%^&*()"?<>|:{}(),.]/, "Password must contain at least one special character"),
        confirmPass: Yup.string().required("Confirm Password is required")
            .oneOf([Yup.ref('password')], 'Passwords must match')
    });

    const signupMutation = useMutation({
        mutationFn: addUser,
        onSuccess: () => {
            navigate("/dashboard"); // Redirect to dashboard after success
        },
    });

    const signupHandler = (values: any) => {
        const { confirmPass, ...data } = values; // Exclude confirmPass from payload
        signupMutation.mutate(data);
    };

    return (
        <div className="signup-container">
            <div className="left-section">
                <img src={logo} alt="EyeRefer" className="signup-image" />
            </div>

            <div className="right-section">
                <Formik
                    initialValues={{
                        firstname: '',
                        lastname: '',
                        email: '',
                        phonenumber: '',
                        password: '',
                        confirmPass: ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={signupHandler}>
                    {() => (
                        <Form className='signup-form'>
                            <h3 className='signup-heading'>Sign Up</h3>
                            <hr className="separator" />
                            <div style={{ display: "flex", gap: "10px", width: "fit-content" }}>
                                <div className="form-group">
                                    <label>First Name</label>
                                    <Field type="text" name="firstname" className="form-control" />
                                    <ErrorMessage name="firstname" component="div" className="text-danger" />
                                </div>

                                <div className="form-group">
                                    <label>Last Name</label>
                                    <Field type="text" name="lastname" className="form-control" />
                                    <ErrorMessage name="lastname" component="div" className="text-danger" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Email Address</label>
                                <Field type="email" name="email" className="form-control" />
                                <ErrorMessage name="email" component="div" className="text-danger" />
                            </div>

                            <div className="form-group">
                                <label>Enter Phone No.</label>
                                <Field type="number" name="phonenumber" className="form-control" />
                                <ErrorMessage name="phonenumber" component="div" className="text-danger" />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <Field type="password" name="password" className="form-control" />
                                <ErrorMessage name="password" component="div" className="text-danger" />
                            </div>

                            <div className="form-group">
                                <label>Confirm Password</label>
                                <Field type="password" name="confirmPass" className="form-control" />
                                <ErrorMessage name="confirmPass" component="div" className="text-danger" />
                            </div>

                            <Link to={'/login'}>
                                <span className="login">Login</span>
                            </Link>

                            <button type="submit" className="signup-btn">SIGN UP</button>
                        </Form>
                    )}
                </Formik>
            </div>

            <footer className="footer">© 2023 DR. Palig. All rights reserved.</footer>
        </div>
    );
};

export default Signup;
