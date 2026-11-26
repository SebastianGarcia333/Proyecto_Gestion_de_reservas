--
-- PostgreSQL database dump
--

\restrict ShCE1KqJ3xcTI3aypd3MgbvwPQcH4KH3awlwHUdVcfo9DAfzKR3Bz3lCutMjSoS

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

-- Started on 2026-11-26 12:52:56

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 221 (class 1259 OID 17037)
-- Name: destinos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.destinos (
    id_destino integer NOT NULL,
    nombre character varying(120) NOT NULL,
    pais character varying(100) NOT NULL,
    ciudad character varying(100) NOT NULL,
    descripcion text,
    imagen_url character varying(255),
    activo boolean
);


ALTER TABLE public.destinos OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 17102)
-- Name: mensajes_contacto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mensajes_contacto (
    id_mensaje integer NOT NULL,
    id_usuario integer,
    nombre_remitente character varying(120) NOT NULL,
    email_remitente character varying(150) NOT NULL,
    asunto character varying(150),
    mensaje text NOT NULL,
    fecha_envio timestamp without time zone
);


ALTER TABLE public.mensajes_contacto OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 17088)
-- Name: pagos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pagos (
    id_pago integer NOT NULL,
    id_reserva integer NOT NULL,
    monto numeric(12,2) NOT NULL,
    metodo_pago character varying(30) NOT NULL,
    estado_pago character varying(20),
    fecha_pago timestamp without time zone
);


ALTER TABLE public.pagos OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 17048)
-- Name: paquetes_viaje; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paquetes_viaje (
    id_paquete integer NOT NULL,
    id_destino integer NOT NULL,
    titulo character varying(150) NOT NULL,
    descripcion text,
    precio_por_persona numeric(10,2) NOT NULL,
    duracion_dias integer NOT NULL,
    cupos_disponibles integer NOT NULL
);


ALTER TABLE public.paquetes_viaje OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 17066)
-- Name: reservas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservas (
    id_reserva integer NOT NULL,
    id_usuario integer NOT NULL,
    id_paquete integer NOT NULL,
    fecha_reserva timestamp without time zone,
    fecha_inicio_viaje date NOT NULL,
    fecha_fin_viaje date NOT NULL,
    cantidad_viajeros integer NOT NULL,
    total_pagar numeric(12,2) NOT NULL,
    estado character varying(20)
);


ALTER TABLE public.reservas OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 17012)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id_rol integer NOT NULL,
    nombre_rol character varying(50) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 17019)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id_usuario integer NOT NULL,
    id_rol integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash character varying(255) NOT NULL,
    telefono character varying(20),
    fecha_registro timestamp without time zone
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 5001 (class 0 OID 17037)
-- Dependencies: 221
-- Data for Name: destinos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.destinos (id_destino, nombre, pais, ciudad, descripcion, imagen_url, activo) FROM stdin;
1	Cartagena de Indias	Colombia	Cartagena	Ciudad colonial, playas caribeñas y cultura.	https://images.unsplash.com/photo-1535490392237-6a9d2b1a3e1b	t
2	San Andres	Colombia	San Andres	Isla paradisiaca de aguas cristalinas.	https://images.unsplash.com/photo-1519046904884-53103b34b206	t
3	Medellin	Colombia	Medellin	Ciudad de la eterna primavera y cultura urbana.	https://images.unsplash.com/photo-1518621736915-f3b1c7e7c9e8	t
4	Santa Marta	Colombia	Santa Marta	Playas, naturaleza y montañas.	https://images.unsplash.com/photo-1507525428034-b723cf961d3e	t
5	Paris	Francia	Paris	Monumentos, museos y gastronomia europea.	https://images.unsplash.com/photo-1502602898657-3e91760cbb34	t
6	Cancun	Mexico	Cancun	Resorts, playas y actividades acuaticas.	https://images.unsplash.com/photo-1510097467424-534e4c7d1e8d	t
7	Cusco	Peru	Cusco	Historia Inca, montanas y arqueologia.	https://images.unsplash.com/photo-1526392060635-9d6019884377	t
8	Tokyo	Japon	Tokyo	Tecnologia, anime, cultura y gastronomia japonesa.	https://images.unsplash.com/photo-1540959733332-eab4deabeeaf	t
9	San Gil	Colombia	San Gil	Destino de aventura, rafting y senderismo.	https://images.unsplash.com/photo-1470770841072-f978cf4d019e	t
10	Villa de Leyva	Colombia	Villa de Leyva	Arquitectura colonial y paisajes historicos.	https://images.unsplash.com/photo-1516483638261-f4dbaf036963	t
11	Guatape	Colombia	Guatape	Embalse, paisajes y la famosa Piedra del Penol.	https://images.unsplash.com/photo-1470770841072-f978cf4d019e	t
12	Rio de Janeiro	Brasil	Rio de Janeiro	Playas, samba y paisajes urbanos.	https://images.unsplash.com/photo-1483729558449-99ef09a8c325	t
13	Madrid	Espana	Madrid	Arte, gastronomia y cultura espanola.	https://images.unsplash.com/photo-1539037116277-4db20889f2d4	t
14	Punta Cana	Republica Dominicana	Punta Cana	Resorts, playas y descanso tropical.	https://images.unsplash.com/photo-1499793983690-e29da59ef1c2	t
15	New York	Estados Unidos	New York	Rascacielos, parques, museos y entretenimiento.	https://images.unsplash.com/photo-149 NYC	t
\.


--
-- TOC entry 5005 (class 0 OID 17102)
-- Dependencies: 225
-- Data for Name: mensajes_contacto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mensajes_contacto (id_mensaje, id_usuario, nombre_remitente, email_remitente, asunto, mensaje, fecha_envio) FROM stdin;
1	2	Laura Martinez	laura.martinez@gmail.com	Informacion sobre Cartagena	Quisiera saber si el paquete incluye transporte desde el aeropuerto.	2026-11-26 12:38:39.819905
2	3	Andres Rodriguez	andres.rodriguez@gmail.com	Consulta sobre San Andres	¿El paquete incluye las actividades acuaticas y transporte a Johnny Cay?	2026-11-26 12:38:39.819905
3	4	Camila Torres	camila.torres@gmail.com	Opciones de pago	Me gustaria saber si puedo pagar mi viaje en varias cuotas.	2026-11-26 12:38:39.819905
4	\N	Pedro Sanchez	pedro.sanchez@hotmail.com	Destino internacional	Estoy interesado en viajar a Paris. ¿Tienen opciones de financiacion?	2026-11-26 12:38:39.819905
5	6	Juan Perez	juan.perez@gmail.com	Disponibilidad de paquetes	¿Hay disponibilidad para viajar a Santa Marta durante enero?	2026-11-26 12:38:39.819905
6	7	Sofia Ramirez	sofia.ramirez@gmail.com	Viaje familiar	Quisiera cotizar un viaje para cuatro personas a Cancun.	2026-11-26 12:38:39.819905
7	\N	Maria Fernanda	mariafernanda@gmail.com	Experiencias de aventura	¿Que actividades de aventura ofrecen en San Gil?	2026-11-26 12:38:39.819905
8	8	Miguel Castro	miguel.castro@gmail.com	Viaje a Japon	¿El paquete Tokyo incluye visitas guiadas y transporte publico?	2026-11-26 12:38:39.819905
9	9	Valentina Moreno	valentina.moreno@gmail.com	Consulta Guatape	¿El tour incluye el ingreso a la Piedra del Penol?	2026-11-26 12:38:39.819905
10	10	Sebastian Lopez	sebastian.lopez@gmail.com	Viaje a Nueva York	Quisiera recibir informacion sobre requisitos para viajar a Estados Unidos.	2026-11-26 12:38:39.819905
11	11	Natalia Herrera	natalia.herrera@gmail.com	Viaje a Madrid	¿El paquete incluye tiquetes aereos y desayuno?	2026-11-26 12:38:39.819905
12	12	Felipe Vargas	felipe.vargas@gmail.com	Reserva Punta Cana	Estoy interesado en un paquete todo incluido para viajar en familia.	2026-11-26 12:38:39.819905
\.


--
-- TOC entry 5004 (class 0 OID 17088)
-- Dependencies: 224
-- Data for Name: pagos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pagos (id_pago, id_reserva, monto, metodo_pago, estado_pago, fecha_pago) FROM stdin;
1	1	1700000.00	Tarjeta	Aprobado	2026-11-26 12:38:29.29772
2	2	1500000.00	PSE	Aprobado	2026-11-26 12:38:29.29772
3	2	1400000.00	PSE	Aprobado	2026-11-26 12:38:29.29772
4	3	200000.00	Transferencia	Pendiente	2026-11-26 12:38:29.29772
5	4	2940000.00	Tarjeta	Aprobado	2026-11-26 12:38:29.29772
6	5	6500000.00	Tarjeta	Aprobado	2026-11-26 12:38:29.29772
7	6	8400000.00	PSE	Reembolsado	2026-11-26 12:38:29.29772
8	7	1000000.00	Transferencia	Pendiente	2026-11-26 12:38:29.29772
9	8	7200000.00	Tarjeta	Aprobado	2026-11-26 12:38:29.29772
10	9	2200000.00	PSE	Aprobado	2026-11-26 12:38:29.29772
11	10	960000.00	Tarjeta	Reembolsado	2026-11-26 12:38:29.29772
12	11	780000.00	PSE	Aprobado	2026-11-26 12:38:29.29772
13	12	2500000.00	Transferencia	Pendiente	2026-11-26 12:38:29.29772
14	13	9000000.00	Tarjeta	Aprobado	2026-11-26 12:38:29.29772
15	14	11700000.00	PSE	Aprobado	2026-11-26 12:38:29.29772
16	15	1000000.00	Transferencia	Pendiente	2026-11-26 12:38:29.29772
\.


--
-- TOC entry 5002 (class 0 OID 17048)
-- Dependencies: 222
-- Data for Name: paquetes_viaje; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.paquetes_viaje (id_paquete, id_destino, titulo, descripcion, precio_por_persona, duracion_dias, cupos_disponibles) FROM stdin;
1	1	Cartagena Magica	Hotel, desayuno y recorrido por la ciudad amurallada.	850000.00	4	20
2	2	San Andres Paraiso	Alojamiento, vuelos y tour por Johnny Cay.	1450000.00	5	15
3	3	Medellin Cultural	Tour por la ciudad, Comuna 13 y alojamiento.	650000.00	3	25
4	4	Santa Marta Natural	Visita al Tayrona y alojamiento cerca de la playa.	980000.00	5	18
5	5	Paris Romantico	Recorrido por la Torre Eiffel y el Museo del Louvre.	6500000.00	7	10
6	6	Cancun Todo Incluido	Hotel todo incluido, playa y actividades acuaticas.	4200000.00	6	12
7	7	Aventura en Cusco	Valle Sagrado y experiencia Machu Picchu.	3800000.00	6	14
8	8	Tokyo Moderno	Experiencia cultural, hotel y recorridos por Tokyo.	7200000.00	8	8
9	9	San Gil Extremo	Rafting, deportes de aventura y alojamiento.	550000.00	3	20
10	10	Villa de Leyva Colonial	Hotel y recorrido por sitios historicos.	480000.00	2	16
11	11	Guatape Aventura	Tour por el embalse y ascenso a la Piedra del Penol.	390000.00	2	20
12	12	Rio de Janeiro Tropical	Playas de Copacabana, city tour y alojamiento.	5200000.00	7	10
13	13	Madrid Cultural	Recorrido por museos, plazas y gastronomia.	4500000.00	6	12
14	14	Punta Cana Relax	Resort todo incluido y actividades en la playa.	3900000.00	5	15
15	15	New York City Experience	Tour por Manhattan, Central Park y Times Square.	5800000.00	7	10
\.


--
-- TOC entry 5003 (class 0 OID 17066)
-- Dependencies: 223
-- Data for Name: reservas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reservas (id_reserva, id_usuario, id_paquete, fecha_reserva, fecha_inicio_viaje, fecha_fin_viaje, cantidad_viajeros, total_pagar, estado) FROM stdin;
1	2	1	2026-11-26 12:38:22.977499	2026-12-10	2026-12-14	2	1700000.00	Confirmada
2	3	2	2026-11-26 12:38:22.977499	2026-12-15	2026-12-20	2	2900000.00	Confirmada
3	4	3	2026-11-26 12:38:22.977499	2026-12-20	2026-12-23	1	650000.00	Pendiente
4	6	4	2026-11-26 12:38:22.977499	2027-01-10	2027-01-15	3	2940000.00	Confirmada
5	7	5	2026-11-26 12:38:22.977499	2027-02-01	2027-02-08	2	13000000.00	Confirmada
6	8	6	2026-11-26 12:38:22.977499	2027-02-15	2027-02-21	2	8400000.00	Cancelada
7	9	7	2026-11-26 12:38:22.977499	2027-03-01	2027-03-07	1	3800000.00	Pendiente
8	10	8	2026-11-26 12:38:22.977499	2027-03-15	2027-03-23	2	14400000.00	Confirmada
9	11	9	2026-11-26 12:38:22.977499	2027-04-01	2027-04-04	4	2200000.00	Confirmada
10	12	10	2026-11-26 12:38:22.977499	2027-04-10	2027-04-12	2	960000.00	Cancelada
11	2	11	2026-11-26 12:38:22.977499	2027-05-01	2027-05-03	2	780000.00	Confirmada
12	3	12	2026-11-26 12:38:22.977499	2027-05-15	2027-05-22	1	5200000.00	Pendiente
13	4	13	2026-11-26 12:38:22.977499	2027-06-01	2027-06-07	2	9000000.00	Confirmada
14	6	14	2026-11-26 12:38:22.977499	2027-06-15	2027-06-20	3	11700000.00	Confirmada
15	7	15	2026-11-26 12:38:22.977499	2027-07-01	2027-07-08	1	5800000.00	Pendiente
\.


--
-- TOC entry 4999 (class 0 OID 17012)
-- Dependencies: 219
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id_rol, nombre_rol) FROM stdin;
1	Administrador
2	Cliente
3	Agente de viajes
\.


--
-- TOC entry 5000 (class 0 OID 17019)
-- Dependencies: 220
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id_usuario, id_rol, nombre, apellido, email, password_hash, telefono, fecha_registro) FROM stdin;
1	1	Stevan	Quijano	admin@pasionviajera.com	demo_hash_admin	3100000001	2026-11-26 12:37:43.497817
2	2	Laura	Martinez	laura.martinez@gmail.com	demo_hash_001	3100000002	2026-11-26 12:37:43.497817
3	2	Andres	Rodriguez	andres.rodriguez@gmail.com	demo_hash_002	3100000003	2026-11-26 12:37:43.497817
4	2	Camila	Torres	camila.torres@gmail.com	demo_hash_003	3100000004	2026-11-26 12:37:43.497817
5	3	Daniela	Gomez	daniela.gomez@pasionviajera.com	demo_hash_004	3100000005	2026-11-26 12:37:43.497817
6	2	Juan	Perez	juan.perez@gmail.com	demo_hash_005	3100000006	2026-11-26 12:37:43.497817
7	2	Sofia	Ramirez	sofia.ramirez@gmail.com	demo_hash_006	3100000007	2026-11-26 12:37:43.497817
8	2	Miguel	Castro	miguel.castro@gmail.com	demo_hash_007	3100000008	2026-11-26 12:37:43.497817
9	2	Valentina	Moreno	valentina.moreno@gmail.com	demo_hash_008	3100000009	2026-11-26 12:37:43.497817
10	2	Sebastian	Lopez	sebastian.lopez@gmail.com	demo_hash_009	3100000010	2026-11-26 12:37:43.497817
11	2	Natalia	Herrera	natalia.herrera@gmail.com	demo_hash_010	3100000011	2026-11-26 12:37:43.497817
12	2	Felipe	Vargas	felipe.vargas@gmail.com	demo_hash_011	3100000012	2026-11-26 12:37:43.497817
\.


--
-- TOC entry 4837 (class 2606 OID 17047)
-- Name: destinos destinos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.destinos
    ADD CONSTRAINT destinos_pkey PRIMARY KEY (id_destino);


--
-- TOC entry 4845 (class 2606 OID 17112)
-- Name: mensajes_contacto mensajes_contacto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mensajes_contacto
    ADD CONSTRAINT mensajes_contacto_pkey PRIMARY KEY (id_mensaje);


--
-- TOC entry 4843 (class 2606 OID 17096)
-- Name: pagos pagos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_pkey PRIMARY KEY (id_pago);


--
-- TOC entry 4839 (class 2606 OID 17060)
-- Name: paquetes_viaje paquetes_viaje_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paquetes_viaje
    ADD CONSTRAINT paquetes_viaje_pkey PRIMARY KEY (id_paquete);


--
-- TOC entry 4841 (class 2606 OID 17077)
-- Name: reservas reservas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservas
    ADD CONSTRAINT reservas_pkey PRIMARY KEY (id_reserva);


--
-- TOC entry 4833 (class 2606 OID 17018)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id_rol);


--
-- TOC entry 4835 (class 2606 OID 17031)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 4851 (class 2606 OID 17113)
-- Name: mensajes_contacto mensajes_contacto_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mensajes_contacto
    ADD CONSTRAINT mensajes_contacto_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 4850 (class 2606 OID 17097)
-- Name: pagos pagos_id_reserva_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_id_reserva_fkey FOREIGN KEY (id_reserva) REFERENCES public.reservas(id_reserva);


--
-- TOC entry 4847 (class 2606 OID 17061)
-- Name: paquetes_viaje paquetes_viaje_id_destino_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paquetes_viaje
    ADD CONSTRAINT paquetes_viaje_id_destino_fkey FOREIGN KEY (id_destino) REFERENCES public.destinos(id_destino);


--
-- TOC entry 4848 (class 2606 OID 17083)
-- Name: reservas reservas_id_paquete_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservas
    ADD CONSTRAINT reservas_id_paquete_fkey FOREIGN KEY (id_paquete) REFERENCES public.paquetes_viaje(id_paquete);


--
-- TOC entry 4849 (class 2606 OID 17078)
-- Name: reservas reservas_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservas
    ADD CONSTRAINT reservas_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 4846 (class 2606 OID 17032)
-- Name: usuarios usuarios_id_rol_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.roles(id_rol);


-- Completed on 2026-11-26 12:52:57

--
-- PostgreSQL database dump complete
--

\unrestrict ShCE1KqJ3xcTI3aypd3MgbvwPQcH4KH3awlwHUdVcfo9DAfzKR3Bz3lCutMjSoS

