//npm
import React, { Component } from "react";
import _ from "lodash";
import { List } from "immutable";

//internals
import GridContainer from "components/Internals/Grid/GridContainer";
import GridItem from "components/Internals/Grid/GridItem";
import Card from "components/Internals/Card/Card";
import CardHeader from "components/Internals/Card/CardHeader";
import CardBody from "components/Internals/Card/CardBody";
import CardFooter from "components/Internals/Card/CardFooter";
import Snackbar from "components/Internals/Snackbar/Snackbar";

//components
import TableManager from "components/TableQuestions/tableManager";
import RowWidth from "components/TableQuestions/rowWidth";
import RowHeader from "components/TableQuestions/rowHeader";
import RowBody from "components/TableQuestions/rowBody";
import QuestionCellDialog from "components/TableQuestions/questionCellDialog";
import TableFooter from "components/TableQuestions/tableFooter";
import QuestionCellConfirmDialog from "components/QuestionManage/questionCellConfirmDialog";

//api
import api from "apis/index";

//common
import commonAction from "common/index";
import hubs from "hubs/index";

//material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import Divider from "@material-ui/core/Divider/Divider";

//icons
import Save from "@material-ui/icons/Save";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import ConfigColumn from "components/TableQuestions/configControls/columns";
import ConfigControlsDialog from "components/TableQuestions/configControls/configControlsDialog";

const TableQuestionContext = React.createContext();

const { Provider, Consumer } = TableQuestionContext;

const delayTimer = 1000;

const delayShowCellSettingDialog = 1000;

const columnMax = 10;

const rowMax = 15;

let inputNodes = [];

class TableQuestion extends Component {
  state = {
    tableManager: {},
    tableBody: {
      data: {}
    },
    questionCellDialog: {
      isOpen: false
    },
    populateTable: false,
    alert: {
      savedUpdates: false
    }
  };

  api = {
    getOptionsQuickAdd: (
      responseTypeId,
      name,
      value,
      column,
      row,
      questionTableId
    ) => {
      const tableInfo = {
        column,
        row,
        questionTableId
      };

      api
        .get()
        .optionsQuickAdd(
          this.actions.internal.getAuthHeader(),
          responseTypeId,
          tableInfo
        )
        .then(response => {
          const quickAdd = _.isEmpty(response)
            ? {}
            : {
                values: List(response)
              };

          this.setState(state => {
            return {
              ...state,
              questionCellDialog: {
                ...state.questionCellDialog,
                inputs: {
                  ...state.questionCellDialog.inputs,
                  [name]: value
                },
                quickAdd
              },
              lastAction: "handleOnTextChange"
            };
          });
        });
    },
    updateQuestionTable: inputValues => {
      const tableId = this.state.questionTableId;

      api
        .update()
        .questionTable(
          this.actions.internal.getAuthHeader(),
          inputValues,
          tableId
        )
        .then(() => {
          this.actions.tableBody.handleRefreshQuestionTable();

          const _that = this;

          _.delay(function() {
            _that.actions.internal.showThenHideAlert();
          }, 700);
        });
    },
    getQuestionTables: () => {
      return api
        .get()
        .getQuestionTables(this.actions.internal.getAuthHeader())
        .then(data => {
          return data;
        });
    },
    getQuestionTableDetails: async () => {
      const questionId = this.props.questionId;

      await this.api.getQuestionTables().then(questions => {
        api
          .get()
          .getQuestionTableDetails(
            this.actions.internal.getAuthHeader(),
            questionId
          )
          .then(data => {
            this.setState(state => {
              return {
                ...state,
                lastAction: "getQuestionTableDetails",
                tableManager: {
                  ...state.tableManager,
                  inputs: {
                    hasHeader: data.hasHeader,
                    questionId: parseInt(questionId, 10),
                    totalColumns: data.totalColumns,
                    totalRows: data.totalRows
                  },
                  data: {
                    questions: List(questions)
                  }
                },
                questionTableId: data.tableId
              };
            });

            this.actions.tableManager.updateTableBodyState(data);
          });
      });
    },
    getQuestionCellSettings: () => {
      api
        .get()
        .getQuestionCellSettings(this.actions.internal.getAuthHeader())
        .then(data => {
          this.setState(state => {
            return {
              ...state,
              questionCellDialog: {
                ...state.questionCellDialog,
                cellSettings: List(data)
              }
            };
          });
        });
    },
    insertNewQuestionTable: () => {
      const inputs = this.state.tableManager.inputs;

      api
        .insert()
        .questionTable(this.actions.internal.getAuthHeader(), inputs)
        .then(data => {
          this.setState(state => {
            return {
              ...state,
              questionTableId: data.questionTableId
            };
          });
        })
        .then(() => {
          this.api.getQuestionTableDetails();
        });
    }
  };

  actions = {
    tableManager: {
      handleOnSave: () => {
        const inputs = this.state.tableManager.inputs;

        const allInputsProvided =
          typeof inputs.totalRows !== "undefined" &&
          typeof inputs.totalColumns !== "undefined" &&
          typeof inputs.hasHeader !== "undefined" &&
          typeof inputs.questionId !== "undefined";

        if (allInputsProvided) {
          // this.actions.tableManager.updateTableBodyState(inputs);

          this.api.insertNewQuestionTable();
        }
      },
      constructColumnIds: (rows, columns, hasHeader) => {
        let columnIds = {};

        const maxRows = hasHeader ? rows - 1 : rows;

        for (let row = 0; row < maxRows; row++) {
          for (let col = 0; col < columns; col++) {
            const id = "body-row" + row + "-col" + col;

            //This is for the header
            if (hasHeader && row === 0) {
              columnIds[id + "-header"] = {
                text: ""
              };
            }

            columnIds[id] = {
              text: ""
            };
          }
        }

        return columnIds;
      },
      updateTableBodyState: inputs => {
        const columnIds = this.actions.tableManager.constructColumnIds(
          inputs.totalRows,
          inputs.totalColumns,
          inputs.hasHeader
        );

        let iconButtons = {};

        let widthValues = {};

        const { headers, cells, widths } = inputs;

        if (typeof headers !== "undefined") {
          headers.map(prop => {
            const id = "body-row0-col" + (prop.column - 1) + "-header";

            if (typeof columnIds[id] !== "undefined") {
              columnIds[id].text = prop.text;
            }

            return prop;
          });
        }
        if (typeof cells !== "undefined") {
          cells.map(prop => {
            const row = prop.row - 2;

            const column = prop.column - 1;

            const id = "body-row" + row + "-col" + column + "";

            const data = columnIds[id];

            if (typeof data === "undefined") {
              return prop;
            }

            const cellSettings = prop.cellSettings;

            if (typeof cellSettings !== "undefined") {
              data.column = column;

              data.row = row;

              const {
                value,
                requiredType,
                responseType,
                maxLength,
                questionId,
                legacyPdfid,
                legacyPdfidChars
              } = cellSettings;

              data.text = value;

              data.inputs = {
                requiredType,
                responseType,
                maxLength,
                questionId,
                legacyPdfid,
                legacyPdfidChars
              };

              iconButtons[id] = true;
            } else {
              if (typeof data !== "undefined") {
                data.text = prop.value;
              }
            }

            return prop;
          });
        }
        if (typeof widths !== "undefined") {
          widths.map(prop => {
            widthValues[prop.column - 1] = prop.width;

            return prop;
          });
        }

        this.actions.tableManager.setupTableBodyRowsAndColumns(
          columnIds,
          iconButtons,
          widthValues
        );
      },
      setupTableBodyRowsAndColumns: (columnIds, iconButtons, widths) => {
        this.setState(state => {
          return {
            ...state,
            populateTable: _.isEmpty(columnIds) === false,
            lastAction: "setupTableBodyRowsAndColumns", //do not change. Used by 'rowWidth'
            tableBody: {
              ...state.tableBody,
              data: {
                ...state.tableBody.data,
                values: columnIds
              },
              iconButtons,
              widths
            }
          };
        });
      },
      rowEvents: {
        deleteIconButtonRow: (iconButtons, inputs) => {
          const { hasHeader, totalRows } = inputs;

          const rowId = `body-row${parseInt(totalRows, 10) -
            (hasHeader ? 1 : 0)}`;

          let newIconButtons = {};

          for (const key in iconButtons) {
            if (iconButtons.hasOwnProperty(key)) {
              if (key.indexOf(rowId) === -1) {
                newIconButtons[key] = true;
              }
            }
          }

          return newIconButtons;
        },
        deleteRow: (dataValues, inputs) => {
          const newDataValue = {};

          // let columnIndex = 0;

          const { hasHeader, totalRows } = inputs;

          const clonedDataValues = _.cloneDeep(dataValues);

          const rowId = `body-row${parseInt(totalRows, 10) -
            (hasHeader ? 1 : 0)}`;

          // while (columnIndex < totalColumns) {
          for (const key in clonedDataValues) {
            if (clonedDataValues.hasOwnProperty(key)) {
              if (key.indexOf(rowId) === -1) {
                newDataValue[key] = clonedDataValues[key];
              }
            }
          }

          // columnIndex++;
          // }

          return newDataValue;
        },
        insertNewRow: (inputs, dataValues) => {
          const { hasHeader, totalRows, totalColumns } = inputs;

          const rows = parseInt(totalRows, 10) - 1 - (hasHeader ? 1 : 0);

          let newIds = {};

          let columnIndex = 0;

          while (columnIndex < totalColumns) {
            const id = "body-row" + rows + "-col" + columnIndex;

            const dataValue = dataValues[id];

            if (typeof dataValue === "undefined") {
              newIds[id] = {
                text: ""
              };
            } else {
              const { text } = dataValue;

              newIds[id] = {
                text: typeof text === "undefined" ? "" : text
              };
            }

            columnIndex++;
          }

          return newIds;
        },
        updateStateAfterOnChangeRow: name => {
          const _that = this;

          _.delay(function() {
            if (name === "totalRows") {
              const { inputs } = _that.state.tableManager;

              const { data, iconButtons } = _that.state.tableBody;

              let insertedRows = {};

              const deletedRows = _that.actions.tableManager.rowEvents.deleteRow(
                data.values,
                inputs
              );

              insertedRows = _that.actions.tableManager.rowEvents.insertNewRow(
                inputs,
                data.values
              );

              // If row reduction, then don't trigger insert
              for (const key in insertedRows) {
                if (typeof deletedRows[key] !== "undefined") {
                  insertedRows = {};
                  break;
                }
              }

              const newIconButtons = _that.actions.tableManager.rowEvents.deleteIconButtonRow(
                iconButtons,
                inputs
              );

              _that.setState(state => {
                // const newStateValue = _.isEmpty(newDataValues)
                //   ? state.tableBody.data.values
                //   : newDataValues;

                return {
                  ...state,
                  lastAction: "tableBodyTextChange_2",
                  lastTarget: name,
                  tableBody: {
                    ...state.tableBody,
                    data: {
                      ...state.tableBody.data,
                      values: {
                        ...deletedRows,
                        ...insertedRows
                      }
                    },
                    iconButtons: {
                      ...newIconButtons
                    }
                  }
                };
              });
            }
          }, 300);
        }
      },
      columnEvents: {
        insertNewColumn: (data, inputs) => {
          function getValue(id) {
            const clonedDataValues = _.cloneDeep(data.values);

            return typeof clonedDataValues[id] === "undefined"
              ? {
                  text: ""
                }
              : clonedDataValues[id];
          }

          const { hasHeader, totalRows, totalColumns } = inputs;

          let rowIndex = 0;

          const newColumns = {};

          const rows = parseInt(totalRows, 10) - 1 - (hasHeader ? 1 : 0);

          while (rowIndex <= rows) {
            let columnIndex = 0;

            while (columnIndex < totalColumns) {
              const id = `body-row${rowIndex}-col${columnIndex}`;

              if (rowIndex === 0) {
                const header = `body-row${rowIndex}-col${columnIndex}-header`;

                newColumns[header] = getValue(header);
              }

              newColumns[id] = getValue(id);

              columnIndex++;
            }
            rowIndex++;
          }

          return newColumns;
        },
        insertNewColumnWidth: (widths, inputs) => {
          let columnIndex = 0;

          const newWidth = {};
          const { totalColumns } = inputs;

          while (columnIndex < totalColumns) {
            const value = widths[columnIndex];

            newWidth[columnIndex] = typeof value === "undefined" ? 10 : value;

            columnIndex++;
          }

          return newWidth;
        },
        deleteIconButtonColumn: (iconButtons, inputs) => {
          const columnId = `-col${inputs.totalColumns}`;

          let newIconButtons = {};

          for (const key in iconButtons) {
            if (iconButtons.hasOwnProperty(key)) {
              if (key.indexOf(columnId) === -1) {
                newIconButtons[key] = true;
              }
            }
          }

          return newIconButtons;
        },
        deleteColumn: (data, inputs) => {
          const clonedDataValues = _.cloneDeep(data.values);

          const newDataValue = {};

          const columnId = `-col${inputs.totalColumns}`;

          for (const key in clonedDataValues) {
            if (clonedDataValues.hasOwnProperty(key)) {
              if (key.indexOf(columnId) === -1) {
                newDataValue[key] = clonedDataValues[key];
              }
            }
          }

          return newDataValue;
        },
        updateStateAfterOnChangeColumn: name => {
          const _that = this;

          _.delay(function() {
            const { inputs } = _that.state.tableManager;

            if (name === "totalColumns") {
              const { data, widths, iconButtons } = _that.state.tableBody;

              //New Column Ids
              let insertedColumns = _that.actions.tableManager.columnEvents.insertNewColumn(
                data,
                inputs
              );

              //Column width
              const newWidth = _that.actions.tableManager.columnEvents.insertNewColumnWidth(
                widths,
                inputs
              );

              //Delete
              const deletedColumns = _that.actions.tableManager.columnEvents.deleteColumn(
                data,
                inputs
              );

              const newIconButtons = _that.actions.tableManager.columnEvents.deleteIconButtonColumn(
                iconButtons,
                inputs
              );

              _that.setState(state => {
                return {
                  ...state,
                  lastAction: "tableBodyTextChange_2",
                  lastTarget: name,
                  tableBody: {
                    ...state.tableBody,
                    data: {
                      ...state.tableBody.data,
                      values: {
                        ...deletedColumns,
                        ...insertedColumns
                      }
                    },
                    widths: {
                      ...newWidth
                    },
                    iconButtons: {
                      ...newIconButtons
                    }
                  }
                };
              });
            }
          }, 300);
        }
      },
      handleOnChangeDebounce: _.debounce(function(name, _that) {
        if (typeof _that.state.questionTableId === "undefined") {
          return;
        }

        // Change 'Row' value
        _that.actions.tableManager.rowEvents.updateStateAfterOnChangeRow(name);

        //Change 'Column' value
        _that.actions.tableManager.columnEvents.updateStateAfterOnChangeColumn(
          name
        );
      }, 600),
      appendNewRowIfHeaderIsTrue: value => {
        this.setState(state => {
          const { totalRows, hasHeader } = state.tableManager.inputs;

          if (value === hasHeader) {
            return {
              ...state
            };
          }

          const newValue = value ? totalRows + 1 : totalRows - 1;

          return {
            ...state,
            tableManager: {
              ...state.tableManager,
              inputs: {
                ...state.tableManager.inputs,
                totalRows: newValue
              }
            },
            lastAction: "tableManagerTextChange"
          };
        });
      },
      handleOnChange: eventTarget => {
        const { name, value } = eventTarget;

        let inputValue = value;

        if (name === "totalRows" && inputValue > rowMax) {
          inputValue = rowMax;
        }

        if (name === "totalColumns" && inputValue > columnMax) {
          inputValue = columnMax;
        }

        if (name === "hasHeader") {
          this.actions.tableManager.appendNewRowIfHeaderIsTrue(value);
        }

        this.actions.tableManager.handleOnChangeDebounce(name, this);

        this.setState(state => {
          return {
            ...state,
            tableManager: {
              ...state.tableManager,
              inputs: {
                ...state.tableManager.inputs,
                [name]: inputValue
              }
            },
            lastAction: "tableManagerTextChange"
          };
        });
      }
    },
    tableBody: {
      isQuestionCell: id => {
        return this.state.tableBody.iconButtons[id] || false;
      },
      handleOnTextChange: eventTarget => {
        const { name, value, id } = eventTarget;

        const targetName = name.split("|")[0];

        if (targetName === "widthOnTextChange") {
          this.actions.tableBody.updateWidthOnTextChange(id, value, targetName);
        } else {
          //Do not activate onTextChange if its QuestionCell
          if (this.actions.tableBody.isQuestionCell(id)) {
            return;
          }

          this.actions.tableBody.updateBodyOnTextChange(id, value, targetName);
        }
      },
      updateWidthOnTextChange: (id, value, targetName) => {
        let inputValue = value;

        if (value > 100) {
          inputValue = 100;
        }

        this.setState(state => {
          return {
            ...state,
            tableBody: {
              ...state.tableBody,
              data: {
                ...state.tableBody.data,
                [targetName]: {
                  ...state.tableBody.data[targetName],
                  [id]: inputValue
                }
              }
            },
            lastAction: "tableBodyTextChange",
            lastTarget: targetName
          };
        });

        this.actions.internal.broadcastWidthSize();
      },
      updateBodyOnTextChange: (id, value, targetName) => {
        this.setState(state => {
          return {
            ...state,
            lastAction: "tableBodyTextChange_2",
            lastTarget: targetName,
            tableBody: {
              ...state.tableBody,
              data: {
                ...state.tableBody.data,
                values: {
                  ...state.tableBody.data.values,
                  [id]: {
                    ...state.tableBody.data.values[id],
                    text: value
                  }
                }
              }
            }
          };
        });
      },
      handleOnEditCellSetting: (eventTarget, row, column) => {
        // const parentQuestionId = this.actions.internal.getQuestionId();
        //
        // const { history } = this.props;

        const { questionId } = this.state.tableBody.data.values[
          `body-row${row}-col${column}`
        ].inputs;

        // const state = {
        //   referer: "parent",
        //   parentQuestionId: parentQuestionId
        // };

        // history.push(
        //   `${
        //     process.env.PUBLIC_URL
        //   }/sections/${commonAction.getSectionId()}/questions/${questionId}`,
        //   state
        // );

        window.open(
          `${
            process.env.PUBLIC_URL
          }/sections/${commonAction.getSectionId()}/questions/${questionId}?&newTab=`,
          "_blank"
        );
      },
      handleListDownInputNodes: node => {
        inputNodes.push(node);
      },
      calculateWidth: width => {
        const isActualWidth =
          this.state.actualWidth === undefined ? false : this.state.actualWidth;

        const { totalColumns } = this.state.tableManager.inputs;

        let calcWidth = 0;

        if (isActualWidth) {
          calcWidth = width - ((width / 94) * 100 - width);
        } else {
          calcWidth = 94 / totalColumns;
        }

        return calcWidth;
      },
      calculateAdjustedWidth: (column, id) => {
        // if (this.state.lastAction === "tableBodyTextChange") {
        // if (this.state.lastTarget === "width") {
        const _that = this;

        _.delay(function() {
          const data = _that.state.tableBody.data;

          if (typeof data === "undefined") {
            return;
          }

          if (typeof data.widthOnTextChange === "undefined") {
            return;
          }

          const widthValue = data.widthOnTextChange[id];

          if (typeof widthValue === "undefined") {
            return null;
          }

          _that.setState(state => {
            return {
              ...state,
              tableBody: {
                ...state.tableBody,
                widths: {
                  ...state.tableBody.widths,
                  [column]: widthValue
                }
              },
              lastAction: "calculateAdjustedWidth",
              lastTarget: null
            };
          });
          //Delay value should not be more than the value from 'broadcastWidthSize'
        }, delayTimer - 100);
        // }
        // }
      },
      getRows: () => {
        const rows = this.state.tableManager.inputs["totalRows"];

        return rows;
      },
      getColumns: () => {
        const columns = this.state.tableManager.inputs["totalColumns"];

        const array = [];

        for (let i = 0; i < columns; i++) {
          array.push(i);
        }

        return array;
      },
      handleRefreshQuestionTable: () => {
        this.setState(state => {
          return {
            ...state,
            tableBody: {},
            confirmRevert: false,
            populateTable: false
          };
        });

        const _that = this;

        _.delay(function() {
          _that.api.getQuestionTableDetails();

          _that.api.getQuestionCellSettings();
        }, 500);
      },
      retrieveCache: (cache, id, row, column) => {
        this.actions.cellDialog.setFocus();

        const inputs = cache[id].inputs;

        const isIconCellSetting =
          this.state.tableBody.data.values[id].inputs || false;

        this.setState(state => {
          return {
            ...state,
            tableBody: {
              ...state.tableBody,
              data: {
                ...state.tableBody.data,
                values: {
                  ...state.tableBody.data.values,
                  [id]: cache[id]
                }
              },
              focusId: {
                [id]: true
              }
            },
            questionCellDialog:
              typeof inputs === "undefined"
                ? { ...state.questionCellDialog }
                : {
                    ...state.questionCellDialog,
                    isOpen: true,
                    selectedCellIds: {
                      id,
                      row,
                      column
                    },
                    isIconCellSetting: isIconCellSetting,
                    inputs,
                    cellOverwrite: {
                      isOpen: false
                    }
                  },
            lastAction: "handleOnToggleClick"
          };
        });
      }
    },
    cellDialog: {
      setFocus: () => {
        const _that = this;

        _.delay(function() {
          const selectedId = _that.state.questionCellDialog.selectedCellIds.id;

          _that.actions.internal.setFocusToPresentInputText(selectedId);
        }, 300);
      },
      handleCellConfirmDialogCancel: toggledId => {
        this.actions.cellDialog.setFocus();

        this.setState(state => {
          const iconButtons = state.tableBody.iconButtons;

          const invertIconButtons =
            typeof iconButtons === "undefined" ? true : !iconButtons[toggledId];

          return {
            ...state,
            tableBody: {
              ...state.tableBody,
              iconButtons: {
                ...state.tableBody.iconButtons,
                [toggledId]: invertIconButtons
              },
              focusId: {
                [toggledId]: true
              }
            },
            questionCellDialog: {
              ...state.questionCellDialog,
              cellOverwrite: {
                isOpen: false
              },
              inputs: {}
            },
            lastAction: "handleOnCloseDialog"
          };
        });
      },
      cacheCurrentCellDetails: (id, values) => {
        this.setState(state => {
          return {
            ...state,
            tableBody: {
              ...state.tableBody,
              cache: {
                ...state.tableBody.cache,
                [id]: values
              }
            },
            lastAction: "cacheQuestionCell"
          };
        });
      },
      handleCellConfirmDialogYes: (id, row, column) => {
        const isCellSetting = this.state.tableBody.iconButtons[id];

        const values = this.state.tableBody.data.values[id];

        const cellDialog = this.actions.cellDialog;

        cellDialog.setFocus();

        cellDialog.cacheCurrentCellDetails(id, values);

        if (isCellSetting === false) {
          const isFromCellSetting = typeof values.row !== "undefined";

          if (isFromCellSetting) {
            this.setState(state => {
              return {
                ...state,
                tableBody: {
                  ...state.tableBody,
                  data: {
                    ...state.tableBody.data,
                    values: {
                      ...state.tableBody.data.values,
                      [id]: {
                        text: ""
                      }
                    }
                  }
                },
                questionCellDialog: {
                  ...state.questionCellDialog,
                  cellOverwrite: {
                    isOpen: false
                  }
                },
                lastAction: "debounceOnToggleClick"
              };
            });
          }

          return;
        } else {
          let inputs = {};

          if (typeof values !== "undefined") {
            if (typeof values.inputs !== "undefined") {
              const {
                maxLength,
                requiredType,
                responseType,
                legacyPdfid,
                legacyPdfidChars
              } = values.inputs;

              inputs = {
                maxLength,
                requiredType,
                responseType,
                legacyPdfid,
                legacyPdfidChars
              };
            }
          }

          const iconCellSettingValue = this.state.tableBody.data.values[id];

          let isIconCellSetting = false;

          if (typeof iconCellSettingValue !== "undefined") {
            isIconCellSetting = iconCellSettingValue.inputs || false;
          }

          const tableInfo = {
            column,
            row,
            questionTableId: this.state.questionTableId
          };

          api
            .get()
            .optionsQuickAdd(
              this.actions.internal.getAuthHeader(),
              inputs.responseType,
              tableInfo
            )
            .then(response => {
              const quickAdd = _.isEmpty(response)
                ? {}
                : {
                    values: List(response)
                  };

              this.setState(state => {
                return {
                  ...state,
                  questionCellDialog: {
                    ...state.questionCellDialog,
                    isOpen: true,
                    selectedCellIds: {
                      id,
                      row,
                      column
                    },
                    isIconCellSetting: isIconCellSetting,
                    inputs,
                    cellOverwrite: {
                      isOpen: false
                    },
                    quickAdd
                  },
                  lastAction: "debounceOnToggleClick"
                };
              });
            });
        }
      },
      debounceOnToggleClick: _.debounce(function(_that, id, row, column) {
        const isCellSetting = _that.state.tableBody.iconButtons[id];

        const values = _that.state.tableBody.data.values[id];

        //If newly added row from the very bottom most.
        if (typeof values === "undefined") {
          openCellSetting(true);
          return;
        }

        //If the current cell is 'text plain', and the button selected is also 'text plain'
        if (typeof values.inputs === "undefined") {
          if (isCellSetting === false) {
            return;
          }
        }

        //If the current cell is 'question', and the button selected is also 'question'
        if (typeof values.inputs !== "undefined") {
          if (isCellSetting === true) {
            _that.actions.cellDialog.handleCellConfirmDialogYes(
              id,
              row,
              column
            );

            return;
          }
        }

        if (typeof values.text === "undefined") {
          _that.actions.cellDialog.handleCellConfirmDialogYes(id, row, column);
        } else {
          const cache = _that.state.tableBody.cache;

          let isNewQuestionCell = values.text.replace(/\s+/g, "") === "";

          if (typeof cache !== "undefined") {
            if (typeof cache[id] !== "undefined") {
              _that.actions.tableBody.retrieveCache(cache, id, row, column);

              return;
            }
          }

          openCellSetting(isNewQuestionCell);
        }

        function openCellSetting(isNewQuestionCell) {
          _that.actions.cellDialog.showCellSettingDialog(
            id,
            row,
            column,
            isCellSetting,
            isNewQuestionCell
          );
        }
      }, delayShowCellSettingDialog),
      showCellSettingDialog: (
        id,
        row,
        column,
        isCellSetting,
        isNewQuestionCell
      ) => {
        if (isNewQuestionCell) {
          this.setState(state => {
            return {
              ...state,
              questionCellDialog: {
                ...state.questionCellDialog,
                cellOverwrite: {
                  ...state.questionCellDialog.cellOverwrite,
                  id: id,
                  isCellSetting: isCellSetting,
                  row,
                  column
                },
                selectedCellIds: {
                  id,
                  row,
                  column
                }
              }
            };
          });

          const _that = this;

          _.delay(function() {
            _that.actions.cellDialog.handleCellConfirmDialogYes(
              id,
              row,
              column
            );
          }, 200);

          return;
        }

        this.setState(state => {
          return {
            ...state,
            questionCellDialog: {
              ...state.questionCellDialog,
              cellOverwrite: {
                ...state.questionCellDialog.cellOverwrite,
                id: id,
                isOpen: true,
                isCellSetting: isCellSetting,
                row,
                column
              },
              selectedCellIds: {
                id,
                row,
                column
              }
            }
          };
        });
      },
      handleOnToggleClick: (id, row, column) => {
        const toggledId = "body-row" + row + "-col" + column;

        this.actions.cellDialog.debounceOnToggleClick(
          this,
          toggledId,
          row,
          column
        );

        this.setState(state => {
          const iconButtons = state.tableBody.iconButtons;

          const invertIconButtons =
            typeof iconButtons === "undefined" ? true : !iconButtons[toggledId];

          return {
            ...state,
            tableBody: {
              ...state.tableBody,
              iconButtons: {
                ...state.tableBody.iconButtons,
                [toggledId]: invertIconButtons
              },
              focusId: {
                [toggledId]: true
              }
            },
            lastAction: "handleOnToggleClick"
          };
        });
      },
      handleOnCloseDialog: isIconCellSetting => {
        const selectedId = this.state.questionCellDialog.selectedCellIds.id;

        this.actions.internal.setFocusToPresentInputText(selectedId);

        this.setState(state => {
          const newCache = _.cloneDeep(state.tableBody.cache);

          delete newCache[selectedId];

          return {
            ...state,
            tableBody: {
              ...state.tableBody,
              iconButtons: {
                ...state.tableBody.iconButtons,
                [selectedId]: isIconCellSetting
              },
              cache: {
                ...newCache
              }
            },
            questionCellDialog: {
              ...state.questionCellDialog,
              isOpen: false,
              isIconCellSetting: false,
              inputs: {},
              quickAdd: {}
            },
            lastAction: "handleOnCloseDialog"
          };
        });
      },
      checkIfQuickAddOptionBeShown: () => {
        const dialog = this.state.questionCellDialog;

        const input = dialog.inputs;

        if (
          typeof input !== "undefined" &&
          this.state.lastAction !== "setStateQuickAddDialog"
        ) {
          if (
            this.actions.cellDialog.checkResponseType(input.responseType) ===
            false
          ) {
            this.setState(state => {
              return {
                ...state,
                questionCellDialog: {
                  ...state.questionCellDialog,
                  quickAdd: {}
                },
                lastAction: "setStateQuickAddDialog"
              };
            });
          }
        }
      },
      checkResponseType: value => {
        if (
          value === 3 /*radiobuttons*/ ||
          value === 4 /*checkbox*/ ||
          value === 7 /*dropdown*/
        ) {
          return true;
        }

        return false;
      },
      handleOnTextChange: event => {
        const { name, value } = event.target;

        const { selectedCellIds } = this.state.questionCellDialog;

        if (
          name === "responseType" &&
          this.actions.cellDialog.checkResponseType(value)
        ) {
          const { column, row } = selectedCellIds;

          const { questionTableId } = this.state;

          this.api.getOptionsQuickAdd(
            value,
            name,
            value,
            column,
            row,
            questionTableId
          );

          return;
        }

        this.setState(state => {
          return {
            ...state,
            questionCellDialog: {
              ...state.questionCellDialog,
              inputs: {
                ...state.questionCellDialog.inputs,
                [name]: value
              }
            },
            lastAction: "handleOnTextChange"
          };
        });
      },
      handleOnSave: () => {
        const dialog = { ...this.state.questionCellDialog };

        const inputs = dialog.inputs;

        const { id, row, column } = dialog.selectedCellIds;

        const responseType = _.first(
          _.filter(dialog.cellSettings.toJS(), {
            groupId: 1,
            id: inputs.responseType
          })
        );

        this.setState(state => {
          return {
            ...state,
            lastAction: "dialogOnSave",
            lastTarget: "dialog",
            tableBody: {
              ...state.tableBody,
              data: {
                ...state.tableBody.data,
                values: {
                  ...state.tableBody.data.values,
                  [id]: {
                    ...state.tableBody.data.values[id],
                    text: responseType.name,
                    row: row,
                    column: column,
                    inputs: inputs
                  }
                }
              }
            }
          };
        });

        this.actions.cellDialog.handleOnCloseDialog(true);
      }
    },
    footer: {
      handleOnSaveChanges: () => {
        const { data, widths } = this.state.tableBody;

        const { values } = data;

        const masterValues = this.state.tableManager.inputs;

        let inputValues = [];

        let widthValues = [];

        for (const key in values) {
          if (values.hasOwnProperty(key)) {
            // const {} = values[key];

            const ids = key.split("-");

            const row = parseInt(ids[1].replace("row", ""), 0);

            const column = parseInt(ids[2].replace("col", ""), 0);

            const isHeader = ids.length > 3 ? ids[3] === "header" : false;

            const perValue = values[key];

            const cellSettings = perValue.inputs;

            const text =
              typeof cellSettings === "undefined"
                ? perValue.text === ""
                  ? null
                  : perValue.text
                : null;

            inputValues.push({
              id: key,
              row,
              column,
              isHeader,
              text,
              cellSettings
            });
          }
        }

        for (const key in widths) {
          if (widths.hasOwnProperty(key)) {
            widthValues.push({
              column: key,
              value: parseFloat(widths[key], 10).toFixed(2)
            });
          }
        }

        this.api.updateQuestionTable({
          inputValues,
          widthValues,
          masterValues
        });
      },
      handleOnDeleteTable: () => {
        this.setState(state => {
          return {
            ...state,
            deleteTable: {
              isOpen: true
            }
          };
        });
      },
      handleOnCancelChanges: () => {
        this.setState(state => {
          return {
            ...state,
            confirmRevert: true
          };
        });
      },
      actualWidth: () => {
        this.setState(state => {
          return {
            ...state,
            actualWidth: !state.actualWidth,
            lastAction: "actualWidthToggled"
          };
        });
      },
      confirmRevert: {
        handleConfirmRevertYes: () => {
          this.actions.tableBody.handleRefreshQuestionTable();
        },
        handleConfirmRevertCancel: () => {
          this.setState(state => {
            return {
              ...state,
              confirmRevert: false
            };
          });
        }
      },
      deleteTable: {
        handleOnYes: () => {
          const questionId = this.actions.internal.getQuestionId();

          api
            .delete()
            .tableAndCells(this.actions.internal.getAuthHeader(), questionId)
            .then(() => {
              this.api.getQuestionTableDetails();

              this.api.getQuestionCellSettings();

              this.setState(state => {
                return {
                  ...state,
                  deleteTable: {
                    isOpen: false
                  }
                };
              });
            });
        },
        handleOnCancel: () => {
          this.setState(state => {
            return {
              ...state,
              deleteTable: {
                isOpen: false
              }
            };
          });
        }
      }
    },
    internal: {
      getAuthHeader: () => {
        return `Bearer ${localStorage.getItem("jwtToken")}`;
      },
      getQuestionId: () => {
        return commonAction.getQuestionId();
      },
      registerHub: () => {
        const { start, connection } = hubs.connect("questionTable");

        const _that = this;

        const func = () => {
          connection.on("RefreshQuestionTable", function() {
            _that.actions.tableBody.handleRefreshQuestionTable();
          });
        };

        start().then(func);
      },
      broadcastWidthSize: () => {
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

        const _that = this;

        //Delay value should not be less than the value from 'calculateAdjustedWidth'
        delay(delayTimer).then(() => {
          _that.setState(state => {
            return {
              ...state,
              lastAction: "tableBodyTextChange",
              lastTarget: "delayer"
            };
          });
        });
      },
      setFocusToPresentInputText: selectedId => {
        inputNodes.map(prop => {
          if (prop === null) {
            return prop;
          }

          if (prop.id === selectedId) {
            _.delay(function() {
              prop.focus();
            }, 100);
          }
          return prop;
        });
      },
      showThenHideAlert: () => {
        let timer;

        (_that => {
          _that.setState(state => {
            return {
              ...state,
              alert: {
                savedUpdates: true
              }
            };
          });

          window.clearTimeout(timer);

          timer = window.setTimeout(function() {
            _that.setState(state => {
              return {
                ...state,
                alert: {
                  savedUpdates: false
                }
              };
            });
          }, 1500);
        })(this);
      }
    },
    configControl: {
      handleOnOpen: (index, type) => {
        this.setState(state => {
          return {
            ...state,
            configControls: {
              ...state.configControls,
              isOpen: true,
              type: type,
              index
            }
          };
        });
      },
      handleOnClose: () => {
        this.setState(state => {
          return {
            ...state,
            configControls: {
              ...state.configControls,
              isOpen: false
            }
          };
        });
      },
      column: {
        common: {
          rewriteColumnAndRowIds: (totalRows, totalColumns, hasHeader) => {
            let newRowIds = {};

            let rowIndex = 0;

            while (rowIndex < totalRows - 1) {
              let columnIdx = 0;

              while (columnIdx < totalColumns - 1) {
                const id = "body-row" + rowIndex + "-col" + columnIdx;

                newRowIds[id] = {};

                if (rowIndex === 0 && hasHeader === true) {
                  newRowIds[id + "-header"] = {};
                }

                columnIdx++;
              }

              rowIndex++;
            }

            return {
              newRowIds
            };
          },
          updateCellDialogColumnInfo: dataValues => {
            const newDataValues = _.cloneDeep(dataValues);

            for (const key in newDataValues) {
              if (typeof newDataValues[key].column !== "undefined") {
                const values = key.split("-");

                const column = parseInt(values[2].replace("col", ""), 0);

                newDataValues[key].column = column;
              }
            }

            return newDataValues;
          }
        },
        onDeleteColumn: {
          getLeftAndRightValues: (columnIndex, totalColumns) => {
            const clonedDataValues = _.cloneDeep(
              this.state.tableBody.data.values
            );

            const leftValues = {};

            let rightValues = {};

            for (const key in clonedDataValues) {
              if (key.indexOf(`-col${columnIndex}`) === -1) {
                //Starts at selected column
                let idx = columnIndex;

                let hasExceed = false;

                //list down all ids that is after the deleted column
                while (idx < totalColumns - 1) {
                  if (key.indexOf(`-col${idx + 1}`) > -1) {
                    hasExceed = true;

                    rightValues[key] = clonedDataValues[key];
                  }
                  idx++;
                }

                if (hasExceed === false) {
                  leftValues[key] = clonedDataValues[key];
                }
              }
            }

            return {
              leftValues,
              rightValues
            };
          },
          sortValues: (
            leftValues,
            rightValues,
            totalRows,
            totalColumns,
            selectedColumnIndex
          ) => {
            let rowIndex = 0;

            let newValues = [];

            let newIconButtons = {};

            const { iconButtons } = this.state.tableBody;

            while (rowIndex < totalRows - 1) {
              let columnIdx = 0;

              while (columnIdx <= totalColumns - 1) {
                const id = "body-row" + rowIndex + "-col" + columnIdx;

                IconButtons(columnIdx, id);

                InsertNew(id);

                InsertNewIfHeader(id, rowIndex);

                columnIdx++;
              }

              rowIndex++;
            }

            function IconButtons(columnIdx, id) {
              if (typeof iconButtons[id] !== "undefined") {
                if (selectedColumnIndex < columnIdx) {
                  //If left column, decrease column index
                  const iconButtonsId =
                    "body-row" +
                    rowIndex +
                    "-col" +
                    (parseInt(columnIdx, 10) - 1);

                  newIconButtons[iconButtonsId] = true;
                } else {
                  if (selectedColumnIndex === columnIdx) {
                    //deleted column
                  } else {
                    newIconButtons[id] = iconButtons[id];
                  }
                }
              }
            }

            function InsertNew(id) {
              const headerLeftValue = leftValues[id];

              const headerRightValue = rightValues[id];

              if (typeof headerLeftValue !== "undefined") {
                newValues.push(headerLeftValue);
              }
              if (typeof headerRightValue !== "undefined") {
                newValues.push(headerRightValue);
              }
            }

            function InsertNewIfHeader(id, idx) {
              if (idx === 0) {
                const headerLeftValue = leftValues[id + "-header"];

                const headerRightValue = rightValues[id + "-header"];

                if (typeof headerLeftValue !== "undefined") {
                  newValues.push(headerLeftValue);
                }
                if (typeof headerRightValue !== "undefined") {
                  newValues.push(headerRightValue);
                }
              }
            }

            return { newValues, newIconButtons };
          },
          mergeIdAndValues: (newValues, newRowIds) => {
            let index = 0;

            let newDataValues = {};

            for (const key in newRowIds) {
              newDataValues[key] = newValues[index];

              index++;
            }

            return newDataValues;
          },
          removeFromWidth: (columnIndex, widths) => {
            let index = 0;

            let newWidths = {};

            for (const key in widths) {
              if (parseInt(columnIndex, 10) === parseInt(key, 10)) {
                continue;
              }

              newWidths[index] = widths[key];

              index++;
            }

            return newWidths;
          },
          updateState: (
            newDataValues,
            newWidths,
            totalColumns,
            newIconButtons
          ) => {
            this.setState(state => {
              return {
                ...state,
                tableBody: {
                  ...state.tableBody,
                  data: {
                    ...state.tableBody.data,
                    values: {
                      ...newDataValues
                    }
                  },
                  widths: {
                    ...newWidths
                  },
                  iconButtons: {
                    ...newIconButtons
                  }
                },
                configControls: {
                  ...state.configControls,
                  isOpen: false
                },
                tableManager: {
                  ...this.state.tableManager,
                  inputs: {
                    ...this.state.tableManager.inputs,
                    totalColumns: parseInt(totalColumns, 10) - 1
                  }
                },
                lastAction: "onColumnConfig"
              };
            });
          },
          deleteNow: (
            columnIndex,
            totalColumns,
            totalRows,
            widths,
            hasHeader
          ) => {
            const {
              common,
              onDeleteColumn
            } = this.actions.configControl.column;

            const {
              leftValues,
              rightValues
            } = onDeleteColumn.getLeftAndRightValues(columnIndex, totalColumns);

            const { newRowIds } = common.rewriteColumnAndRowIds(
              totalRows,
              totalColumns,
              hasHeader
            );

            const { newValues, newIconButtons } = onDeleteColumn.sortValues(
              leftValues,
              rightValues,
              totalRows,
              totalColumns,
              columnIndex
            );

            const newDataValues = onDeleteColumn.mergeIdAndValues(
              newValues,
              newRowIds
            );

            const newWidths = onDeleteColumn.removeFromWidth(
              columnIndex,
              widths
            );

            const updatedDataValues = common.updateCellDialogColumnInfo(
              newDataValues
            );

            onDeleteColumn.updateState(
              updatedDataValues,
              newWidths,
              totalColumns,
              newIconButtons
            );
          }
        },
        onInsertNew: {
          getNewValuesAfterInsert: (
            columnIndex,
            totalRows,
            direction,
            hasHeader
          ) => {
            const isLeft = direction === "left";

            const { data, iconButtons } = this.state.tableBody;

            const clonedDataValues = _.cloneDeep(data.values);

            let newColumnValues = {};

            let newIconButtons = {};

            let notYetInserted = false;

            const InsertIncrementOldColumn = (
              splitKey,
              columnNumber,
              key,
              addOn
            ) => {
              const body = splitKey[0];

              const row = splitKey[1];

              const newColumn = "col" + (columnNumber + (isLeft ? addOn : 1));

              const keyValue = `${body}-${row}-${newColumn}`;

              if (typeof iconButtons[key] !== "undefined") {
                newIconButtons[keyValue] = true;
              }

              if (key.indexOf("-header") === -1) {
                newColumnValues[keyValue] = clonedDataValues[key];
              }

              if (hasHeader === true) {
                const header = clonedDataValues[key + "-header"];

                if (typeof header !== "undefined") {
                  newColumnValues[`${keyValue}-header`] = header;
                }
              }
            };

            const InsertNewestColumn = () => {
              if (notYetInserted === false) {
                let rowIndex = 0;

                while (rowIndex < totalRows - 1) {
                  const defaultText = { text: "" };

                  const insertedKey = `body-row${rowIndex}-col${columnIndex +
                    (isLeft ? 0 : 1)}`;

                  newColumnValues[insertedKey] = defaultText;

                  if (rowIndex === 0 && hasHeader === true) {
                    newColumnValues[`${insertedKey}-header`] = defaultText;
                  }

                  rowIndex++;
                }

                notYetInserted = true;
              }
            };

            for (const key in clonedDataValues) {
              const splitKey = key.split("-");

              const columnNumber = parseInt(splitKey[2].replace("col", ""), 10);

              const condition = isLeft
                ? columnNumber < columnIndex
                : columnNumber > columnIndex;

              if (columnIndex === 0 && isLeft) {
                InsertNewestColumn();
              }

              if (condition) {
                InsertNewestColumn();

                InsertIncrementOldColumn(splitKey, columnNumber, key, 0);
              } else {
                if (isLeft) {
                  InsertIncrementOldColumn(splitKey, columnNumber, key, 1);
                } else {
                  newColumnValues[key] = clonedDataValues[key];
                }
              }
            }

            return { newColumnValues, newIconButtons };
          },
          insertNewWidth: (widths, columnIndex, direction) => {
            let index = 0;

            let newWidths = {};

            let addOn = 0;

            while (index <= _.size(widths)) {
              if (index === columnIndex + (direction === "left" ? 0 : 1)) {
                newWidths[index] = 12;
                addOn++;
              }

              if (typeof widths[index] === "undefined") {
                index++;
                continue;
              }

              newWidths[index + addOn] = widths[index];

              index++;
            }

            return newWidths;
          },
          mergeIdAndValues: (newRowIds, newColumnValues) => {
            for (const key in newColumnValues) {
              newRowIds[key] = newColumnValues[key];
            }

            return _.cloneDeep(newRowIds);
          },
          insertNow: (
            totalRows,
            totalColumns,
            widths,
            columnIndex,
            hasHeader,
            direction
          ) => {
            const { onInsertNew, common } = this.actions.configControl.column;

            const newWidths = onInsertNew.insertNewWidth(
              widths,
              columnIndex,
              direction
            );

            const { newRowIds } = common.rewriteColumnAndRowIds(
              totalRows,
              totalColumns + 2,
              hasHeader
            );

            const {
              newColumnValues,
              newIconButtons
            } = onInsertNew.getNewValuesAfterInsert(
              columnIndex,
              totalRows,
              direction,
              hasHeader
            );

            const newDataValues = onInsertNew.mergeIdAndValues(
              newRowIds,
              newColumnValues
            );

            const updatedDataValues = common.updateCellDialogColumnInfo(
              newDataValues
            );

            onInsertNew.updateState(
              newWidths,
              updatedDataValues,
              newIconButtons
            );
          },
          updateState: (newWidths, newDataValues, newIconButtons) => {
            const iconButtons = _.isEmpty(newIconButtons)
              ? this.state.tableBody.iconButtons
              : newIconButtons;

            this.setState(state => {
              return {
                ...state,
                tableBody: {
                  ...state.tableBody,
                  data: {
                    ...state.tableBody.data,
                    values: {
                      ...newDataValues
                    }
                  },
                  widths: {
                    ...newWidths
                  },
                  iconButtons
                },
                tableManager: {
                  ...state.tableManager,
                  inputs: {
                    ...state.tableManager.inputs,
                    totalColumns: state.tableManager.inputs.totalColumns + 1
                  }
                },
                configControls: {
                  ...state.configControls,
                  isOpen: false
                },
                lastAction: "onColumnConfig"
              };
            });
          }
        },
        execute: selectIndex => {
          const columnIndex = this.state.configControls.index;

          const widths = this.state.tableBody.widths;

          const {
            hasHeader,
            totalColumns,
            totalRows
          } = this.state.tableManager.inputs;

          const {
            onDeleteColumn,
            onInsertNew
          } = this.actions.configControl.column;

          //Delete a column
          if (selectIndex === 0) {
            onDeleteColumn.deleteNow(
              columnIndex,
              totalColumns,
              totalRows,
              widths,
              hasHeader
            );

            return;
          }

          onInsertNew.insertNow(
            totalRows,
            totalColumns,
            widths,
            columnIndex,
            hasHeader,
            selectIndex === 1 ? "right" : "left"
          );
        }
      },
      row: {
        common: {
          updateState: (newRowValues, totalRows, newIconButtons) => {
            this.setState(state => {
              return {
                ...state,
                tableBody: {
                  ...state.tableBody,
                  data: {
                    ...state.tableBody.data,
                    values: {
                      ...newRowValues
                    }
                  },
                  iconButtons: {
                    ...newIconButtons
                  }
                },
                configControls: {
                  ...state.configControls,
                  isOpen: false
                },
                tableManager: {
                  ...this.state.tableManager,
                  inputs: {
                    ...this.state.tableManager.inputs,
                    totalRows: totalRows
                  }
                },
                lastAction: "onRowConfig"
              };
            });
          },
          updateCellDialogRowInfo: rowValues => {
            const newRowValues = _.cloneDeep(rowValues);

            for (const key in newRowValues) {
              if (typeof newRowValues[key].row !== "undefined") {
                const values = key.split("-");

                const row = parseInt(values[1].replace("row", ""), 0);

                newRowValues[key].row = row;
              }
            }

            return newRowValues;
          }
        },
        onDeleteRow: {
          getNewRowValues: (rowIndex, hasHeader) => {
            const tableBody = this.state.tableBody;

            const clonedDataValues = _.cloneDeep(tableBody.data.values);

            const { iconButtons } = tableBody;

            let newIconButtons = {};

            let newRowValues = {};

            const manageRows = (newKeyValue, rowNumber, key, presentValue) => {
              if (rowIndex < rowNumber) {
                //If after the index, decrease present index
                newRowValues[newKeyValue] = presentValue;
              } else {
                //If before the index, copy only
                newRowValues[key] = presentValue;
              }
            };

            const manageIconButtons = (key, rowNumber, newKeyValue) => {
              if (typeof iconButtons[key] !== "undefined") {
                if (rowIndex > rowNumber) {
                  if (rowIndex === rowNumber) {
                    //deleted row
                  } else {
                    //before the selected row index
                    newIconButtons[key] = true;
                  }
                } else {
                  if (rowIndex === rowNumber) {
                    //deleted row
                  } else {
                    //after the selected row index
                    newIconButtons[newKeyValue] = true;
                  }
                }
              }
            };

            for (const key in clonedDataValues) {
              const splitKey = key.split("-");

              const body = splitKey[0];

              const column = splitKey[2];

              const rowNumber = parseInt(splitKey[1].replace("row", ""), 10);

              const newKeyValue = `${body}-row${rowNumber - 1}-${column}`;

              const presentValue = clonedDataValues[key];

              if (key.indexOf("-header") === -1) {
                manageIconButtons(key, rowNumber, newKeyValue);

                if (rowIndex === rowNumber) {
                  //To be deleted row
                } else {
                  manageRows(newKeyValue, rowNumber, key, presentValue);
                }
              } else {
                //--------Header--------
                if (hasHeader === true) {
                  manageRows(
                    `${newKeyValue}-header`,
                    rowNumber,
                    key,
                    presentValue
                  );
                }
              }
            }

            return { newRowValues, newIconButtons };
          },
          deleteNow: () => {
            const { totalRows, hasHeader } = this.state.tableManager.inputs;

            const rowIndex = this.state.configControls.index;

            const { onDeleteRow, common } = this.actions.configControl.row;

            const {
              newRowValues,
              newIconButtons
            } = onDeleteRow.getNewRowValues(rowIndex, hasHeader);

            const updatedRowValues = common.updateCellDialogRowInfo(
              newRowValues
            );

            common.updateState(updatedRowValues, totalRows - 1, newIconButtons);
          }
        },
        onInsertRow: {
          getNewRowValues: (totalColumns, hasHeader, selectIndex) => {
            const rowIndex = this.state.configControls.index;

            const tableBody = this.state.tableBody;

            const clonedDataValues = _.cloneDeep(tableBody.data.values);

            const { iconButtons } = tableBody;

            let newRowValues = {};

            let newIconButtons = {};

            let notYetInserted = false;

            const insertNewThenCopyOld = (
              newKeyValue,
              body,
              rowNumber,
              presentValue
            ) => {
              const defaultValue = {
                text: ""
              };

              if (notYetInserted === false) {
                let columnIndex = 0;

                while (columnIndex < totalColumns) {
                  newRowValues[
                    `${body}-row${rowNumber}-col${columnIndex}`
                  ] = defaultValue;

                  columnIndex++;
                }

                notYetInserted = true;
              }

              newRowValues[`${newKeyValue}`] = presentValue;
            };

            const manageIconButtons = (key, rowNumber, newKeyValue) => {
              const condition =
                selectIndex === 0
                  ? rowIndex <= rowNumber
                  : rowIndex < rowNumber;

              if (typeof iconButtons[key] !== "undefined") {
                if (condition) {
                  //If after the index, increase row
                  newIconButtons[newKeyValue] = true;
                } else {
                  //If before the index, copy only
                  newIconButtons[key] = true;
                }
              }
            };

            for (const key in clonedDataValues) {
              const splitKey = key.split("-");

              const body = splitKey[0];

              const column = splitKey[2];

              const rowNumber = parseInt(splitKey[1].replace("row", ""), 10);

              const presentValue = clonedDataValues[key];

              const newKeyValue = `${body}-row${rowNumber + 1}-${column}`;

              if (key.indexOf("-header") === -1) {
                manageIconButtons(key, rowNumber, newKeyValue);

                // ------------------------------------
                // if insert above
                // ------------------------------------
                if (selectIndex === 0) {
                  if (rowIndex > rowNumber) {
                    //If above the index, copy old
                    insertNewThenCopyOld(key, body, rowIndex, presentValue);
                  } else {
                    //if below the index, increment by 1.
                    newRowValues[newKeyValue] = presentValue;
                  }
                }
                // ------------------------------------
                // if insert below
                // ------------------------------------
                if (selectIndex === 2) {
                  if (rowIndex < rowNumber) {
                    // If below the index
                    insertNewThenCopyOld(
                      newKeyValue,
                      body,
                      rowNumber,
                      presentValue
                    );
                  } else {
                    // If above the index, copy only
                    newRowValues[key] = presentValue;
                  }
                }
              } else {
                // ------------------------------------
                // Header
                // ------------------------------------
                if (hasHeader === true) {
                  newRowValues[key] = presentValue;
                }
              }
            }

            return { newRowValues, newIconButtons };
          },
          insertNow: selectIndex => {
            const {
              totalRows,
              totalColumns,
              hasHeader
            } = this.state.tableManager.inputs;

            const { onInsertRow, common } = this.actions.configControl.row;

            const { getNewRowValues } = onInsertRow;

            const { newRowValues, newIconButtons } = getNewRowValues(
              totalColumns,
              hasHeader,
              selectIndex
            );

            const updatedRowValues = common.updateCellDialogRowInfo(
              newRowValues
            );

            common.updateState(updatedRowValues, totalRows + 1, newIconButtons);
          }
        },
        execute: selectIndex => {
          const { onDeleteRow, onInsertRow } = this.actions.configControl.row;

          //Delete a row
          if (selectIndex === 1) {
            onDeleteRow.deleteNow();
            return;
          }

          onInsertRow.insertNow(selectIndex);
        }
      },
      handleOnSelect: (selectIndex, type) => {
        if (type === "column") {
          this.actions.configControl.column.execute(selectIndex);
        }
        if (type === "row") {
          this.actions.configControl.row.execute(selectIndex);
        }
      }
    }
  };

  componentDidMount() {
    this.api.getQuestionTableDetails();

    this.api.getQuestionCellSettings();

    this.actions.internal.registerHub();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.lastAction === "calculateAdjustedWidth") {
      return false;
    }

    return true;
  }

  componentDidUpdate() {
    this.actions.cellDialog.checkIfQuickAddOptionBeShown();
  }

  componentWillUnmount() {
    inputNodes = [];
  }

  render() {
    const { classes } = this.props;

    const tableManager = this.actions.tableManager;

    const tableBody = this.actions.tableBody;

    const cellDialog = this.actions.cellDialog;

    const configControl = this.actions.configControl;

    return (
      <Provider
        value={{
          tableManager: {
            inputs: this.state.tableManager.inputs,
            data: this.state.tableManager.data,
            onSave: tableManager.handleOnSave,
            onChange: tableManager.handleOnChange
          },
          tableBody: {
            calculateWidth: tableBody.calculateWidth,
            calculateAdjustedWidth: tableBody.calculateAdjustedWidth,
            getRows: tableBody.getRows,
            getColumns: tableBody.getColumns,
            onTextChange: tableBody.handleOnTextChange,
            lastAction: this.state.lastAction,
            state: this.state.tableBody,
            onToggleClick: cellDialog.handleOnToggleClick,
            listDownInputNodes: tableBody.handleListDownInputNodes,
            onEditCellSetting: tableBody.handleOnEditCellSetting
          },
          cellDialog: {
            state: this.state.questionCellDialog,
            onClose: cellDialog.handleOnCloseDialog,
            onTextChange: cellDialog.handleOnTextChange,
            onSave: cellDialog.handleOnSave
          },
          footer: {
            saveChanges: this.actions.footer.handleOnSaveChanges,
            cancelChanges: this.actions.footer.handleOnCancelChanges,
            deleteTable: this.actions.footer.handleOnDeleteTable,
            actualWidth: this.state.actualWidth,
            actualWidthToggle: this.actions.footer.actualWidth,
            confirmRevert: {
              isOpen: this.state.confirmRevert,
              yes: this.actions.footer.confirmRevert.handleConfirmRevertYes,
              cancel: this.actions.footer.confirmRevert
                .handleConfirmRevertCancel
            },
            deleteTableDialog: {
              state: this.state.deleteTable,
              yes: this.actions.footer.deleteTable.handleOnYes,
              cancel: this.actions.footer.deleteTable.handleOnCancel
            }
          },
          configControls: {
            column: {
              state: this.state.configControls
            },
            actions: {
              onOpen: configControl.handleOnOpen,
              onClose: configControl.handleOnClose,
              onSelect: configControl.handleOnSelect
            }
          }
        }}
      >
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Table Question</h4>
              </CardHeader>
              <CardBody>
                <Body
                  isPopulateTable={this.state.populateTable}
                  tableId={this.state.questionTableId}
                  data={this.state.tableBody.data}
                  {...this.state.alert}
                  classes={classes}
                  questionCellDialog={this.state.questionCellDialog}
                  cellDialog={cellDialog}
                />
              </CardBody>
              <CardFooter />
            </Card>
          </GridItem>
        </GridContainer>
      </Provider>
    );
  }
}

function Body({
  isPopulateTable,
  savedUpdates,
  classes,
  questionCellDialog,
  cellDialog,
  tableId,
  data
}) {
  let noTableRecordFound = false;

  if (typeof data !== "undefined") {
    if (typeof data.values !== "undefined") {
      noTableRecordFound = _.isEmpty(data.values);
    }
  }

  const progress = (
    <LinearProgress
      classes={{
        colorPrimary: classes.colorPrimary,
        barColorPrimary: classes.barColorPrimary
      }}
    />
  );

  return (
    <div>
      <TableManager isHideButtons={isPopulateTable} />
      <Divider
        style={isPopulateTable ? { display: "none" } : { marginTop: "1%" }}
      />
      <div style={{ marginTop: "2%" }}>
        <GridContainer>
          {isPopulateTable ? (
            <React.Fragment>
              <ConfigColumn />
              <RowWidth />
              <RowHeader />
              <QuestionCellDialog />
              <RowBody />
            </React.Fragment>
          ) : (
            <span />
          )}
        </GridContainer>
      </div>
      {isPopulateTable ? (
        <div>
          <Divider style={{ marginTop: "3%" }} />
          <TableFooter />
          <Snackbar
            place="br"
            color="success"
            Snackbar
            icon={Save}
            message={"Updates saved successfully"}
            open={savedUpdates}
          />
          <ConfigControlsDialog />
          <QuestionCellConfirmDialog
            cancel={cellDialog.handleCellConfirmDialogCancel}
            yes={cellDialog.handleCellConfirmDialogYes}
            {...questionCellDialog.cellOverwrite}
          />
        </div>
      ) : typeof tableId === "undefined" ? (
        noTableRecordFound === true ? (
          <span />
        ) : (
          progress
        )
      ) : (
        progress
      )}
    </div>
  );
}
const styles = () => ({
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  colorPrimary: {
    backgroundColor: "#f5cdff"
  },
  barColorPrimary: {
    backgroundColor: "#a742b9"
  }
});

export default withStyles(styles)(TableQuestion);

export const TableQuestionConsumer = Consumer;
