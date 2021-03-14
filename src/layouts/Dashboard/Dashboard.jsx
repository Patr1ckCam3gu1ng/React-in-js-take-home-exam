/* eslint-disable */
import React from "react";
import PropTypes from "prop-types";
import {Switch, Route, Redirect} from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components

import Footer from "components/Internals/Footer/Footer.jsx";
import Sidebar from "components/Internals/Sidebar/Sidebar.jsx";

import dashboardRoutes from "routes/dashboard.jsx";

import dashboardStyle from "assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx";

import image from "assets/img/sidebar-4.jpg";
import logo from "assets/img/reactlogo.png";

import Questions from "views/Questions";
import FormVersions from "views/FormVersions";
import Sections from "views/Sections";
import SectionSettings from "views/Sections/SectionSettings";
import Forms from "views/Forms";
import FormsById from "views/Forms/ById";
import Search from "views/Search";
import NewHeader from "components/Internals/NewHeader/NewHeader";

const switchRoutes = (scrollTop) => (
    <Switch>
        {dashboardRoutes.map((prop, key) => {

            if (prop.redirect)
                return <Redirect from={prop.path} to={prop.to} key={key}/>;

            if (prop.component === "Questions") {

                return <Route path={prop.path} render={() => <Questions scrollTop={scrollTop}/>} key={key}/>;
            }
            if (prop.component === "FormVersions") {

                return <Route path={prop.path} render={() => <FormVersions/>} key={key}/>;
            }
            if (prop.component === "FormsById") {

                return <Route path={prop.path} render={() => <FormsById/>} key={key}/>;
            }
            if (prop.component === "Forms") {

                return <Route path={prop.path} render={() => <Forms/>} key={key}/>;
            }
            if (prop.component === "Sections") {

                return <Route path={prop.path} render={() => <Sections scrollTop={scrollTop}/>} key={key}/>;
            }
            if (prop.component === "sectionSettings") {

                return <Route path={prop.path} render={() => <SectionSettings/>} key={key}/>;
            }
            if (prop.component === "Search") {

                return <Route path={prop.path} render={() => <Search/>} key={key}/>;
            }

            //INFO: If you dont want a component to be visible on the sidebar, filter it out here:
            //    Search by keyword:
            //      const Sidebar = ({ ...props }) => {

        })}
    </Switch>
);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileOpen: false
        };
        this.resizeFunction = this.resizeFunction.bind(this);
    }

    handleDrawerToggle = () => {
        this.setState({mobileOpen: !this.state.mobileOpen});
    };
    handleOnScrollTop = () => {
        this.mainPanel.scrollTop = 0;
    };
    closeSideMenu = (e) => {
        if (e === 'header') {
            this.setState({open_side_menu: true})
        } else {
            this.setState({open_side_menu: false})
        }
    };

    getRoute() {
        return this.props.location.pathname !== "/maps";
    }

    resizeFunction() {
        if (window.innerWidth >= 960) {
            this.setState({mobileOpen: false});
        }
    }

    componentDidMount() {
        if (navigator.platform.indexOf("Win") > -1) {
            const ps = new PerfectScrollbar(this.mainPanel);
        }
        window.addEventListener("resize", this.resizeFunction);
    }

    componentDidUpdate(e) {
        if (e.history.location.pathname !== e.location.pathname) {
            this.mainPanel.scrollTop = 0;
            if (this.state.mobileOpen) {
                this.setState({mobileOpen: false});
            }
        }
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resizeFunction);
    }

    render() {
        const {classes, ...rest} = this.props;
        return (
            <div className={classes.wrapper}>
                <NewHeader onClick={e => this.closeSideMenu(e)}/>
                <Sidebar
                    routes={dashboardRoutes}
                    logoText={"BlackFinTech"}
                    logo={logo}
                    image={image}
                    onClick={e => this.closeSideMenu(e)}
                    open={this.state.open_side_menu}
                    color="blue"
                    {...rest}
                />
                <div className={this.state.open_side_menu ? classes.mainPanel : ''} ref={el => (this.mainPanel = el)}>
                    {this.getRoute() ? (
                        <div className={classes.content}>
                            <div className={classes.container}>{switchRoutes(this.handleOnScrollTop)}</div>
                        </div>
                    ) : (
                        <div className={classes.map}>{switchRoutes(this.handleOnScrollTop)}</div>
                    )}
                    {this.getRoute() ? <Footer/> : null}
                </div>
            </div>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(App);
