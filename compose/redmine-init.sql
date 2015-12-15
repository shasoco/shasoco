--
-- Data for Name: auth_sources; Type: TABLE DATA; Schema: public; Owner: redmine
--

COPY auth_sources (id, type, name, host, port, account, account_password, base_dn, attr_login, attr_firstname, attr_lastname, attr_mail, onthefly_register, tls, filter, timeout) FROM stdin;
1	AuthSourceLdap	LDAP	ldap	389	cn=admin,<%=ldapdc%>	<%=rootpassword%>	ou=people,<%=ldapdc%>	uid	givenName	sn	mail	t	f		\N
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: redmine
--

COPY settings (id, name, value, updated_on) FROM stdin;
1	login_required	0	2015-12-14 19:02:47.581138
2	autologin	0	2015-12-14 19:02:47.623911
3	self_registration	0	2015-12-14 19:02:47.637103
4	unsubscribe	0	2015-12-14 19:02:47.647934
5	password_min_length	8	2015-12-14 19:02:47.661978
6	password_max_age	0	2015-12-14 19:02:47.673028
7	lost_password	0	2015-12-14 19:02:47.68685
8	max_additional_emails	5	2015-12-14 19:02:47.697857
9	openid	0	2015-12-14 19:02:47.711733
10	rest_api_enabled	0	2015-12-14 19:02:47.72272
11	jsonp_enabled	0	2015-12-14 19:02:47.73673
12	session_lifetime	0	2015-12-14 19:02:47.747721
13	session_timeout	0	2015-12-14 19:02:47.761951
\.


