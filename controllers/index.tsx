import express from "express";
import React from "react";
import Home from "../views/Home";
import { isAdmin } from "../utils/authentication";
import serveHTML from "../utils/serveHTML";

const index = express.Router();

index.route('/')
    .get(isAdmin, async ( req, res ) => {
        const serverProps = {
            isAdmin: req.session.serverProps.isAdmin
        }
        res.status(200).send(serveHTML(<Home ServerProps={serverProps}/>, 'Home', serverProps));
    });

export default index;