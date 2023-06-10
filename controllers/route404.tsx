import express from "express";
import React from "react";
import serveHTML from "../utils/serveHTML";
import Page404 from "../views/Page404";

const route404 = express.Router();

route404.route('*')
    .get(async ( req, res ) => {
        const serverProps = {
            isAdmin: req.session.serverProps.isAdmin
        }
        
        res.status(404).send(serveHTML(<Page404 ServerProps={serverProps}/>, 'Page404', serverProps));
    });

export default route404;