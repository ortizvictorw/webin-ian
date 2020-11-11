import React, { useMemo, useState } from "react";
import { Addons } from "@webiny/app/components";
import { getPlugins } from "@webiny/plugins";
import { PbPageLayoutComponentPlugin } from "@webiny/app-page-builder/types";
//importaciones Apollo services
import { Query } from "react-apollo";
import get from "lodash.get";
import { getBookData } from "../components/graphql";
//Importacion Componentes
import { Carousel } from "../components/Carousel";
import { Avatar } from "../components/Avatar";





const Static = () => {

    const { header: Header, footer: Footer}: any = useMemo(() => {
        const plugins = getPlugins<PbPageLayoutComponentPlugin>("pb-layout-component");
        return plugins.reduce((acc, item) => {
            acc[item.componentType] = item.component;
            return acc;
        }, {});
    }, []);

    const [datos, setDatos] = useState({
        nombre: '',
        detalle: '',
        url:""
    })
    const handleInputChange = (event) => {
        // console.log(event.target.name)
        // console.log(event.target.value)
        setDatos({
            ...datos,
            [event.target.name] : event.target.value
        })
    }

    const enviarDatos = (event) => {
        event.preventDefault()
        console.log('enviando datos...' + datos.nombre + ' ' + datos.detalle)
    }

return (
    <Query query={getBookData}>
            {({ data: response }) => {
                const { title } = get(response, "book.listBooks.data") || {};
                console.log(title)
           const img = "https://miro.medium.com/max/3150/0*EonuD7lJyRq5A89y.jpeg"
           
           
                
    return (
        <React.Fragment>
            <Addons />
            <Header />


            {/* Carrucel */}
            <div className="d-flex justify-content-beetween ml-4">
            <div className="w-50">
            <Avatar
                alt="Test alt."
                fallbackText="T"
                height={80}
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSoZYU1hrJerYGdRF42l_num8n_IA_3mnyNuw&usqp=CAU"
                width={80}
            />
            <Carousel >
                        <img src={img} />
                        <img src={img} />
                        <img src={img} />
                        <img src={img} />
                        <img src={img} />
                        <img src={img} />
            </Carousel>

            </div>
            <div className=" mx-4">
                <h1>Formulario</h1>
                <form className="row mx-4" onSubmit={enviarDatos}>
                    <div className="col-md-8 mt-2">
                        <input type="text" placeholder="Nombre" className="form-control" onChange={handleInputChange} name="nombre"></input>
                    </div>
                    <div className="col-md-8 my-1">
                        <input type="text" placeholder="Desatacado" className="form-control" onChange={handleInputChange} name="destacado"></input>
                    </div>
                    <div className="col-md-8 my-1">
                        <input type="text" placeholder="URL" className="form-control" onChange={handleInputChange} name="url"></input>
                    </div>
                    <div className="col-md-8 my-1">
                        <textarea  placeholder="Detalle" className="form-control" onChange={handleInputChange} name="detalle"></textarea>
                    </div>
                
                    <button type="submit" className="btn btn-primary my-1 col-md-3 mx-2">Enviar</button>
                </form>
                <ul>
                    {/* <li>{datos.nombre}</li>
                    <li>{datos.detalle}</li> */}
                </ul>
            </div>
            </div>
            <Footer />
            </React.Fragment>
                            )
                        }
                    }
        </Query>
    
    );
};

export default Static;
