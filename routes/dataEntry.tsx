import express from 'express';
import React from 'react';
import { isAdmin } from '../utils/authentication';
import { MongoClient } from 'mongodb';
import DataTypes from '../pages/DataTypes';
import serveHTML from '../utils/serveHTML';
import Page404 from '../pages/Page404';
import JsonEditor from '../pages/jsonEditor';

const dataEntry = express.Router();

const client = new MongoClient('mongodb://127.0.0.1:27017');
client.connect();

dataEntry.route('/')
    .get(isAdmin, async (req, res) => {
        const collections = await (await client.db(process.env.DBName || 'Untitled').listCollections().toArray()).map(doc => doc.name);
        collections.splice(collections.indexOf('User Sessions'), 1);
        collections.splice(collections.indexOf('Users'), 1);

        const serverProps = {
            isAdmin: req.session.serverProps.isAdmin,
            dataTypes: collections
        }

        res.status(200).send(serveHTML(<DataTypes ServerProps={serverProps}></DataTypes>, 'DataTypes', serverProps));
    });

dataEntry.route('/:dataType')
    .get(isAdmin, async (req, res) => {
        let serverProps:ServerPropsType = {
            isAdmin: req.session.serverProps.isAdmin
        }

        const collections = await (await client.db(process.env.DBName || 'Untitled').listCollections().toArray()).map(doc => doc.name);
        collections.splice(collections.indexOf('User Sessions'), 1);
        collections.splice(collections.indexOf('Users'), 1);

        if(!collections.includes(req.params.dataType)) {
            res.status(404).send(serveHTML(<Page404 ServerProps={serverProps}></Page404>, 'Page404', serverProps));
            return;
        }

        const datapieces = await (await client.db(process.env.DBName || 'Untitled').collection(req.params.dataType).find().toArray());

        let dataMap = {};
        datapieces.forEach(dataPiece => {
            const dataBody:{[key:string]:any} = {...dataPiece}
            delete dataBody._id;
            dataMap = {...dataMap,
                [dataPiece._id.toString()]: dataBody
            }
        })

        serverProps = {...serverProps,
            dataPieces: dataMap
        }

        res.status(200).send(serveHTML(<JsonEditor ServerProps={serverProps} currentDataType={req.params.dataType}></JsonEditor>, 'JsonEditor', serverProps));
    })

export default dataEntry;