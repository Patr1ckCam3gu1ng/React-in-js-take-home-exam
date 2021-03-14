//npm
import React, { Component } from "react";
import { List } from "immutable";
import _ from "lodash";
import { withRouter } from "react-router";

//api
import api from "apis/index";

//components
import Snackbar from "components/Internals/Snackbar/Snackbar";

//my Components
import QuestionFilters from "components/Questions/filters";

//material
import SentimentVeryDissatisfied from "@material-ui/icons/SentimentVeryDissatisfied";
import SentimentVerySatisfied from "@material-ui/icons/SentimentVerySatisfied";

//common
import commonAction from "common/index";
import hubs from "hubs/index";

const QuestionContext = React.createContext();

const { Provider, Consumer } = QuestionContext;

const names = {
  providers: "providers",
  forms: "forms",
  formversion: "formversion",
  section: "section",
};

class Questions extends Component {
  state = {
    filters: {
      providers: {
        data: [],
        selectValue: 0,
      },
      forms: {
        data: [],
        selectValue: 0,
      },
      formversion: {
        data: [],
        selectValue: 0,
      },
      section: {
        data: [],
        selectValue: 0,
      },
    },
    table: {
      data: [],
    },
    redirect: false,
    showNoRecordAlert: false,
    progressBar: false,
  };

  actions = {
    getAuthHeader: () => {
      return {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      };
    },
    checkIfUrlOnEditMode: () => {
      const url = window.location.href.split("/");

      const isOnEdit = isNaN(url[url.length - 1]) === false;

      if (isOnEdit) {
        this.setState({
          redirect: true,
        });
      }
    },
    manageUrl: (event, id, url) => {
      const urlLocation = new URL(window.location.href);

      let params = "";

      const { providers, forms, formversion, section } = names;

      const providerValue = urlLocation.searchParams.get(providers);
      const formValue = urlLocation.searchParams.get(forms);
      const formversionValue = urlLocation.searchParams.get(formversion);

      if (id === providers) {
        params += `${id}=${event.value}`;
      }
      if (id === forms) {
        params += `${providers}=${providerValue}&${id}=${event.value}`;
      }
      if (id === formversion) {
        params += `${providers}=${providerValue}&${forms}=${formValue}&${id}=${event.value}`;
      }
      if (id === section) {
        params += `${providers}=${providerValue}&${forms}=${formValue}&${formversion}=${formversionValue}&${id}=${event.value}`;
      }

      this.props.history.push(`${url.url}?&${params}`);
    },
    providers: {
      onChange: (event, id, url) => {
        this.actions.manageUrl(event, id, url);

        this.setState((state) => ({
          filters: {
            providers: {
              ...state.filters.providers,
              selectValue: event.value,
            },
          },
        }));

        this.dbCalls.getProviderForms(event.value);
      },
    },
    forms: {
      onChange: (event, id, url) => {
        this.actions.manageUrl(event, id, url);

        this.setState((state) => ({
          filters: {
            ...state.filters,
            forms: {
              ...state.filters.forms,
              selectValue: event.value,
            },
          },
        }));

        this.dbCalls.getFormVersion(event.value);
      },
    },
    formversion: {
      onChange: (event, id, url) => {
        this.actions.manageUrl(event, id, url);

        this.setState((state) => ({
          filters: {
            ...state.filters,
            formversion: {
              ...state.filters.formversion,
              selectValue: event.value,
            },
          },
        }));

        this.dbCalls.getSections(event.value);
      },
    },
    section: {
      onChange: (event, id, url) => {
        this.actions.manageUrl(event, id, url);

        this.setState((state) => ({
          filters: {
            ...state.filters,
            section: {
              ...state.filters.section,
              selectValue: event.value,
            },
          },
        }));

        this.dbCalls.getSectionQuestions(event.value);
      },
    },
    handleRedirect: () => {
      this.setState({
        redirect: true,
      });
    },
    checkForPrePopulate: () => {
      const urlLocation = new URL(window.location.href);

      const { providers, forms, formversion, section } = names;

      const providerValue = urlLocation.searchParams.get(providers);
      const formValue = urlLocation.searchParams.get(forms);
      const formversionValue = urlLocation.searchParams.get(formversion);
      const sectionValue = urlLocation.searchParams.get(section);

      if (providerValue !== null) {
        this.dbCalls.getFilterSelects({
          providerId: providerValue,
          formId: formValue,
          formVersionId: formversionValue,
          section: sectionValue,
        });
      }

      return providerValue === null;
    },
    showNoRecordAlert: () => {
      this.setState((state) => {
        return {
          ...state,
          showNoRecordAlert: true,
        };
      });

      this.actions.showThenHideAlert("showNoRecordAlert");
    },
    showThenHideAlert: (objectName) => {
      let timer;

      ((_that) => {
        window.clearTimeout(timer);

        timer = window.setTimeout(function () {
          _that.setState((state) => {
            return {
              ...state,
              [objectName]: false,
            };
          });
        }, 1500);
      })(this);
    },
    getSectionQuestionErrors: () => {
      const { formversion, section } = this.state.filters;

      commonAction.getSectionQuestionErrors(
        formversion.selectValue,
        section.selectValue,
        this
      );
    },
    refreshQuestionGrid: () => {
      this.actions.checkForPrePopulate();
    },
    registerHubOnQuestionDelete: () => {
      const { start, connection } = hubs.connect("deleteQuestion");

      const _that = this;

      start().then(() => {
        connection.on("RefreshQuestionListOnDelete", function () {
          _that.actions.refreshQuestionGrid();
        });
      });
    },
  };

  dbCalls = {
    getFilterSelects: (inputs) => {
      api
        .get()
        .filterSelects(this.actions.getAuthHeader(), inputs)
        .then((data) => {
          const providers = _.filter(data, { type: "Providers" });
          const forms = _.filter(data, { type: "Forms" });
          const formVersions = _.filter(data, { type: "FormVersions" });
          const sections = _.filter(data, { type: "Sections" });

          this.setState((state) => {
            return {
              filters: {
                ...state.filters,
                providers: {
                  data: _.some(providers) ? List(providers) : [],
                  selectValue: parseInt(inputs.providerId, 10),
                },
                forms: {
                  data: _.some(forms) ? List(forms) : [],
                  selectValue: parseInt(inputs.formId, 10),
                },
                formversion: {
                  data: _.some(formVersions) ? List(formVersions) : [],
                  selectValue: parseInt(inputs.formVersionId, 10),
                },
                section: {
                  data: _.some(sections) ? List(sections) : [],
                  selectValue: parseInt(inputs.section, 10),
                },
              },
            };
          });

          if (inputs.section !== null) {
            this.dbCalls.getSectionQuestions(parseInt(inputs.section, 10));
          }
        });
    },
    getAllProviders: () => {
      api
        .get()
        .providers(this.actions.getAuthHeader())
        .then((data) => {
          this.setState((state) => {
            return {
              filters: {
                ...state.filters,
                providers: {
                  data: List(data),
                  selectValue: 0,
                },
                forms: {
                  data: [],
                  selectValue: 0,
                },
              },
              table: {
                data: [],
              },
            };
          });
        });
    },
    getProviderForms: (providerId) => {
      api
        .get()
        .forms(this.actions.getAuthHeader(), providerId)
        .then((data) => {
          if (data === "") {
            this.actions.showNoRecordAlert();
          } else {
            this.setState((state) => ({
              filters: {
                ...state.filters,
                forms: {
                  data: List(data),
                  selectValue: 0,
                },
                formversion: {
                  data: [],
                  selectValue: 0,
                },
              },
              table: {
                data: [],
              },
            }));
          }
        });
    },
    getFormVersion: (formId) => {
      api
        .get()
        .formVersion(this.actions.getAuthHeader(), formId)
        .then((data) => {
          if (data === "") {
            this.actions.showNoRecordAlert();
          } else {
            this.setState((state) => ({
              filters: {
                ...state.filters,
                formversion: {
                  data: List(data),
                  selectValue: 0,
                },
                section: {
                  data: [],
                  selectValue: 0,
                },
              },
              table: {
                data: [],
              },
            }));
          }
        });
    },
    getSections: (formversionid) => {
      api
        .get()
        .sections(this.actions.getAuthHeader(), formversionid)
        .then((data) => {
          if (data === "") {
            this.actions.showNoRecordAlert();
          } else {
            this.setState((state) => ({
              filters: {
                ...state.filters,
                section: {
                  data: List(data),
                  selectValue: 0,
                },
              },
              table: {
                data: [],
              },
            }));
          }
        });
    },
    getSectionQuestions: (sectionId) => {
      this.setState({
        table: {
          data: [],
        },
        progressBar: true,
      });

      api
        .get()
        .sectionQuestions(this.actions.getAuthHeader(), sectionId)
        .then((data) => {
          const _that = this;

          _.delay(function () {
            _that.setState((state) => ({
              ...state,
              table: {
                data: List(data),
              },
              progressBar: false,
            }));
          }, 100);
        });
    },
  };

  componentDidMount() {
    if (this.actions.checkForPrePopulate()) {
      this.dbCalls.getAllProviders();
    }

    this.actions.checkIfUrlOnEditMode();

    this.actions.registerHubOnQuestionDelete();
  }

  render() {
    return (
      <Provider
        value={{
          filters: this.state.filters,
          actions: this.actions,
          table: this.state.table,
          redirect: this.state.redirect,
          onRedirect: this.actions.handleRedirect,
          progressBar: this.state.progressBar,
          scrollTop: this.props.scrollTop,
        }}
      >
        <QuestionFilters />
        <Snackbar
          place="br"
          color="danger"
          icon={SentimentVeryDissatisfied}
          message={
            <span>
              <b>Sorry!</b> No Record found
            </span>
          }
          open={this.state.showNoRecordAlert}
        />
        <Snackbar
          place="br"
          color="success"
          icon={SentimentVerySatisfied}
          message={
            <span>
              Hooray! <b>No errors</b> were found.
            </span>
          }
          open={this.state.showNoErrors}
        />
      </Provider>
    );
  }
}

export default withRouter(Questions);

export const QuestionConsumer = Consumer;
