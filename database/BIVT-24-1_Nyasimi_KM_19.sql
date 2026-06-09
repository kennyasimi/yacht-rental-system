--
-- PostgreSQL database dump
--

\restrict C8xUi0yCiDZs3Ek6GhLySFFs2rrbinRYJM6UqgbzesvN9UIEJpdPfwfkf3PHttm

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-06-09 16:46:04

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

--
-- TOC entry 239 (class 1255 OID 24695)
-- Name: calculate_booking_price(integer, date, date); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_booking_price(p_boat_id integer, p_start_date date, p_end_date date) RETURNS numeric
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_price_per_day DECIMAL(10,2);
    v_days INTEGER;
BEGIN
    -- Get boat daily price
    SELECT price_per_day
    INTO v_price_per_day
    FROM boats
    WHERE boat_id = p_boat_id;
    
    -- Calculate days
    v_days := p_end_date - p_start_date;
    
    -- Return calculated price
    RETURN v_price_per_day * v_days;
END;
$$;


--
-- TOC entry 244 (class 1255 OID 32910)
-- Name: cancel_booking(integer); Type: PROCEDURE; Schema: public; Owner: -
--

CREATE PROCEDURE public.cancel_booking(IN p_booking_id integer)
    LANGUAGE plpgsql
    AS $$
BEGIN

    UPDATE bookings
    SET status = 'CANCELLED'
    WHERE booking_id = p_booking_id
      AND status <> 'COMPLETED';

END;
$$;


--
-- TOC entry 248 (class 1255 OID 32934)
-- Name: check_booking_dates(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_booking_dates() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN

    -- Start date cannot be in the past
    IF NEW.start_date < CURRENT_DATE THEN
        RAISE EXCEPTION
        'Booking start date cannot be in the past';
    END IF;

    -- End date must be after start date
    IF NEW.end_date <= NEW.start_date THEN
        RAISE EXCEPTION
        'End date must be later than start date';
    END IF;

    RETURN NEW;

END;
$$;


--
-- TOC entry 247 (class 1255 OID 32933)
-- Name: complete_booking(integer); Type: PROCEDURE; Schema: public; Owner: -
--

CREATE PROCEDURE public.complete_booking(IN p_booking_id integer)
    LANGUAGE plpgsql
    AS $$
BEGIN

    UPDATE bookings
    SET status = 'COMPLETED'
    WHERE booking_id = p_booking_id
      AND status = 'ACTIVE';

END;
$$;


--
-- TOC entry 245 (class 1255 OID 32911)
-- Name: deactivate_boat(integer); Type: PROCEDURE; Schema: public; Owner: -
--

CREATE PROCEDURE public.deactivate_boat(IN p_boat_id integer)
    LANGUAGE plpgsql
    AS $$
BEGIN

    UPDATE boats
    SET is_active = FALSE
    WHERE boat_id = p_boat_id;

END;
$$;


--
-- TOC entry 242 (class 1255 OID 32908)
-- Name: get_average_rating(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_average_rating(p_boat_id integer) RETURNS numeric
    LANGUAGE plpgsql
    AS $$
DECLARE
    avg_rating NUMERIC(3,2);
BEGIN

    SELECT COALESCE(AVG(rating),0)
    INTO avg_rating
    FROM reviews
    WHERE boat_id = p_boat_id;

    RETURN avg_rating;

END;
$$;


--
-- TOC entry 243 (class 1255 OID 32909)
-- Name: get_total_revenue(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_total_revenue() RETURNS numeric
    LANGUAGE plpgsql
    AS $$
DECLARE
    total_revenue DECIMAL(12,2);
BEGIN

    SELECT COALESCE(SUM(amount),0)
    INTO total_revenue
    FROM payments
    WHERE payment_status = 'SUCCESSFUL';

    RETURN total_revenue;

END;
$$;


--
-- TOC entry 246 (class 1255 OID 32912)
-- Name: refund_booking(integer); Type: PROCEDURE; Schema: public; Owner: -
--

CREATE PROCEDURE public.refund_booking(IN p_booking_id integer)
    LANGUAGE plpgsql
    AS $$
BEGIN

    UPDATE payments
    SET payment_status = 'REFUNDED'
    WHERE booking_id = p_booking_id
      AND payment_status = 'SUCCESSFUL';


END;
$$;


--
-- TOC entry 240 (class 1255 OID 24696)
-- Name: set_booking_total_price(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_booking_total_price() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Call the calculation function and set the price
    NEW.total_price := calculate_booking_price(
        NEW.boat_id,
        NEW.start_date,
        NEW.end_date
    );
    
    RETURN NEW;
END;
$$;


--
-- TOC entry 241 (class 1255 OID 24698)
-- Name: update_booking_status_on_payment(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_booking_status_on_payment() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Only proceed if payment is successful
    IF NEW.payment_status = 'SUCCESSFUL' THEN
        -- Update the associated booking status
        UPDATE bookings
        SET status = 'CONFIRMED'
        WHERE booking_id = NEW.booking_id;
    END IF;
    
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 24582)
-- Name: boats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.boats (
    boat_id integer NOT NULL,
    boat_name character varying,
    boat_type character varying,
    capacity integer,
    price_per_day integer
);


--
-- TOC entry 226 (class 1259 OID 24594)
-- Name: bookings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bookings (
    booking_id integer CONSTRAINT boookings_booking_id_not_null NOT NULL,
    user_id integer CONSTRAINT boookings_user_id_not_null NOT NULL,
    boat_id integer CONSTRAINT boookings_boat_id_not_null NOT NULL,
    start_date date,
    end_date date,
    total_price integer,
    status character varying,
    created_at date
);


--
-- TOC entry 237 (class 1259 OID 32900)
-- Name: boat_bookings; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.boat_bookings AS
 SELECT bt.boat_id,
    bt.boat_name,
    b.booking_id,
    b.start_date,
    b.end_date,
    b.status,
    b.total_price
   FROM (public.boats bt
     JOIN public.bookings b ON ((bt.boat_id = b.boat_id)));


--
-- TOC entry 230 (class 1259 OID 24610)
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    review_id integer NOT NULL,
    user_id integer NOT NULL,
    boat_id integer NOT NULL,
    rating integer,
    comment character varying,
    created_at timestamp with time zone,
    booking_id integer
);


--
-- TOC entry 235 (class 1259 OID 32891)
-- Name: boat_ratings; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.boat_ratings AS
 SELECT boat_id,
    round(avg(rating), 2) AS average_rating,
    count(*) AS total_reviews
   FROM public.reviews
  GROUP BY boat_id;


--
-- TOC entry 221 (class 1259 OID 24580)
-- Name: boats_boat_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.boats_boat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5099 (class 0 OID 0)
-- Dependencies: 221
-- Name: boats_boat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.boats_boat_id_seq OWNED BY public.boats.boat_id;


--
-- TOC entry 220 (class 1259 OID 16390)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    user_id integer CONSTRAINT users_id_not_null NOT NULL,
    first_name character varying,
    last_name character varying,
    email character varying,
    password_hash character varying,
    phone character varying,
    role character varying,
    created_at timestamp with time zone
);


--
-- TOC entry 234 (class 1259 OID 32886)
-- Name: booking_details; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.booking_details AS
 SELECT b.booking_id,
    u.user_id,
    u.first_name,
    u.last_name,
    bt.boat_name,
    b.start_date,
    b.end_date,
    b.total_price,
    b.status
   FROM ((public.bookings b
     JOIN public.users u ON ((b.user_id = u.user_id)))
     JOIN public.boats bt ON ((b.boat_id = bt.boat_id)));


--
-- TOC entry 238 (class 1259 OID 32904)
-- Name: bookings_by_period; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.bookings_by_period AS
 SELECT booking_id,
    boat_id,
    user_id,
    start_date,
    end_date,
    total_price,
    status
   FROM public.bookings;


--
-- TOC entry 225 (class 1259 OID 24593)
-- Name: boookings_boat_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.boookings_boat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5100 (class 0 OID 0)
-- Dependencies: 225
-- Name: boookings_boat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.boookings_boat_id_seq OWNED BY public.bookings.boat_id;


--
-- TOC entry 223 (class 1259 OID 24591)
-- Name: boookings_booking_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.boookings_booking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5101 (class 0 OID 0)
-- Dependencies: 223
-- Name: boookings_booking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.boookings_booking_id_seq OWNED BY public.bookings.booking_id;


--
-- TOC entry 224 (class 1259 OID 24592)
-- Name: boookings_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.boookings_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5102 (class 0 OID 0)
-- Dependencies: 224
-- Name: boookings_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.boookings_user_id_seq OWNED BY public.bookings.user_id;


--
-- TOC entry 233 (class 1259 OID 24625)
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    payment_id integer NOT NULL,
    booking_id integer NOT NULL,
    amount numeric,
    payment_method character varying,
    payment_status character varying,
    payment_date character varying
);


--
-- TOC entry 236 (class 1259 OID 32895)
-- Name: payment_history; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.payment_history AS
 SELECT p.payment_id,
    p.booking_id,
    p.amount,
    p.payment_status,
    p.payment_date,
    u.first_name,
    u.last_name,
    bt.boat_name
   FROM (((public.payments p
     JOIN public.bookings b ON ((p.booking_id = b.booking_id)))
     JOIN public.users u ON ((b.user_id = u.user_id)))
     JOIN public.boats bt ON ((b.boat_id = bt.boat_id)));


--
-- TOC entry 232 (class 1259 OID 24624)
-- Name: payments_booking_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payments_booking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5103 (class 0 OID 0)
-- Dependencies: 232
-- Name: payments_booking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payments_booking_id_seq OWNED BY public.payments.booking_id;


--
-- TOC entry 231 (class 1259 OID 24623)
-- Name: payments_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payments_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5104 (class 0 OID 0)
-- Dependencies: 231
-- Name: payments_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payments_payment_id_seq OWNED BY public.payments.payment_id;


--
-- TOC entry 229 (class 1259 OID 24609)
-- Name: reviews_boat_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reviews_boat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5105 (class 0 OID 0)
-- Dependencies: 229
-- Name: reviews_boat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reviews_boat_id_seq OWNED BY public.reviews.boat_id;


--
-- TOC entry 227 (class 1259 OID 24607)
-- Name: reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reviews_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5106 (class 0 OID 0)
-- Dependencies: 227
-- Name: reviews_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reviews_review_id_seq OWNED BY public.reviews.review_id;


--
-- TOC entry 228 (class 1259 OID 24608)
-- Name: reviews_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reviews_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5107 (class 0 OID 0)
-- Dependencies: 228
-- Name: reviews_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reviews_user_id_seq OWNED BY public.reviews.user_id;


--
-- TOC entry 219 (class 1259 OID 16389)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5108 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 4912 (class 2604 OID 24585)
-- Name: boats boat_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.boats ALTER COLUMN boat_id SET DEFAULT nextval('public.boats_boat_id_seq'::regclass);


--
-- TOC entry 4913 (class 2604 OID 24597)
-- Name: bookings booking_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings ALTER COLUMN booking_id SET DEFAULT nextval('public.boookings_booking_id_seq'::regclass);


--
-- TOC entry 4914 (class 2604 OID 24598)
-- Name: bookings user_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings ALTER COLUMN user_id SET DEFAULT nextval('public.boookings_user_id_seq'::regclass);


--
-- TOC entry 4915 (class 2604 OID 24599)
-- Name: bookings boat_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings ALTER COLUMN boat_id SET DEFAULT nextval('public.boookings_boat_id_seq'::regclass);


--
-- TOC entry 4919 (class 2604 OID 24628)
-- Name: payments payment_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments ALTER COLUMN payment_id SET DEFAULT nextval('public.payments_payment_id_seq'::regclass);


--
-- TOC entry 4920 (class 2604 OID 24629)
-- Name: payments booking_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments ALTER COLUMN booking_id SET DEFAULT nextval('public.payments_booking_id_seq'::regclass);


--
-- TOC entry 4916 (class 2604 OID 24613)
-- Name: reviews review_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews ALTER COLUMN review_id SET DEFAULT nextval('public.reviews_review_id_seq'::regclass);


--
-- TOC entry 4917 (class 2604 OID 24614)
-- Name: reviews user_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews ALTER COLUMN user_id SET DEFAULT nextval('public.reviews_user_id_seq'::regclass);


--
-- TOC entry 4918 (class 2604 OID 24615)
-- Name: reviews boat_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews ALTER COLUMN boat_id SET DEFAULT nextval('public.reviews_boat_id_seq'::regclass);


--
-- TOC entry 4911 (class 2604 OID 16393)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4926 (class 2606 OID 24658)
-- Name: boats boats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.boats
    ADD CONSTRAINT boats_pkey PRIMARY KEY (boat_id);


--
-- TOC entry 4928 (class 2606 OID 24606)
-- Name: bookings boookings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT boookings_pkey PRIMARY KEY (booking_id);


--
-- TOC entry 4932 (class 2606 OID 24635)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payment_id);


--
-- TOC entry 4930 (class 2606 OID 24622)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (review_id);


--
-- TOC entry 4922 (class 2606 OID 24689)
-- Name: users unique_user_email; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_user_email UNIQUE (email);


--
-- TOC entry 4924 (class 2606 OID 16398)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4939 (class 2620 OID 32935)
-- Name: bookings trg_check_booking_dates; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_check_booking_dates BEFORE INSERT OR UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.check_booking_dates();


--
-- TOC entry 4940 (class 2620 OID 24697)
-- Name: bookings trg_set_booking_price; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_set_booking_price BEFORE INSERT ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.set_booking_total_price();


--
-- TOC entry 4941 (class 2620 OID 24699)
-- Name: payments trg_update_booking_status; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_booking_status AFTER INSERT ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_booking_status_on_payment();


--
-- TOC entry 4933 (class 2606 OID 32923)
-- Name: bookings boat_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT boat_id FOREIGN KEY (boat_id) REFERENCES public.boats(boat_id) ON DELETE SET NULL NOT VALID;


--
-- TOC entry 4935 (class 2606 OID 32928)
-- Name: reviews boat_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT boat_id FOREIGN KEY (boat_id) REFERENCES public.boats(boat_id) ON DELETE SET NULL NOT VALID;


--
-- TOC entry 4938 (class 2606 OID 24679)
-- Name: payments booking_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT booking_id FOREIGN KEY (booking_id) REFERENCES public.bookings(booking_id) NOT VALID;


--
-- TOC entry 4936 (class 2606 OID 24700)
-- Name: reviews booking_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT booking_id FOREIGN KEY (booking_id) REFERENCES public.bookings(booking_id) NOT VALID;


--
-- TOC entry 4934 (class 2606 OID 32913)
-- Name: bookings user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE SET NULL NOT VALID;


--
-- TOC entry 4937 (class 2606 OID 32918)
-- Name: reviews user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE SET NULL NOT VALID;


-- Completed on 2026-06-09 16:46:04

--
-- PostgreSQL database dump complete
--

\unrestrict C8xUi0yCiDZs3Ek6GhLySFFs2rrbinRYJM6UqgbzesvN9UIEJpdPfwfkf3PHttm

