import React from 'react';
import "./Error404.css"
import { Link } from 'react-router-dom';
const Error404 = () => {
    return (
        <div className="wrap_error404">
            <section className="page_404">
                    <div className="container_404">
                        <div className="four_zero_four_bg">
                            <h1 className="text-center ">404</h1>
                        </div>
                    <div className="text-center contant_box_404">
                            <h3 className="h2">Look like you're lost</h3>
                            <p>the page you are looking for not avaible!</p>
                            <Link to="/" className="link_404">
                                Go to Home
                            </Link>
                        </div>
                    </div>
            </section>

        </div>

    );
};

export default Error404;
