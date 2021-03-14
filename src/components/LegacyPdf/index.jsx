import React, { Component } from "react";
import _ from "lodash";
import * as PropTypes from "prop-types";

//material
import Dialog from "@material-ui/core/Dialog/Dialog";
import TextField from "@material-ui/core/TextField/TextField";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import Divider from "@material-ui/core/Divider/Divider";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import IconButton from "@material-ui/core/IconButton/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Grid from "@material-ui/core/Grid";
import Beenhere from "@material-ui/icons/Beenhere";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import Cancel from "@material-ui/icons/Cancel";

//components
import Snackbar from "components/Internals/Snackbar/Snackbar";
import ConfirmDialog from "components/LegacyPdf/ChangeTypeConfirmDialog";

//common
import commonAction from "common/index";

//api
import api from "apis/index";

function ErrorElements(hasErrorText, hasMinimumRowError, hasDuplicateError) {
  return (
    <div>
      {hasErrorText ? (
        <label style={{ color: "red" }}>
          A PDF Input with that name already exists for this Form Version
          <br />
          <br />
        </label>
      ) : (
        <span />
      )}
      {hasMinimumRowError ? (
        <label style={{ color: "red" }}>
          Range should have at least two(2) PDF Inputs
          <br />
          <br />
        </label>
      ) : (
        <span />
      )}
      {hasDuplicateError ? (
        <label style={{ color: "red" }}>
          Duplicate name detected
          <br />
          <br />
        </label>
      ) : (
        <span />
      )}
    </div>
  );
}

function GetErrorValues(
  rowValues,
  arrKey,
  errorDbExistingId,
  isLastColumn,
  isErrorMinimumRow,
  errorDuplicateId
) {
  const legacyId = rowValues[arrKey.toString() + "0"];

  const legacyIdValue =
    typeof legacyId === "undefined" ? false : legacyId.value;

  const hasErrorRow =
    legacyIdValue === errorDbExistingId &&
    legacyIdValue !== "" &&
    errorDbExistingId !== "";

  const hasErrorText = isLastColumn && hasErrorRow;

  const hasMinimumRowError = isLastColumn && isErrorMinimumRow;

  const hasDuplicateError =
    errorDuplicateId === legacyIdValue &&
    typeof errorDuplicateId !== "undefined"
      ? errorDuplicateId !== ""
      : false;

  return {
    hasErrorText,
    hasMinimumRowError,
    hasDuplicateError,
    hasErrorRow,
  };
}

function RowsAndColumnsInput({
  classes,
  isMultiInput,
  inputRow,
  maxRows,
  rowValues,
  inputDelete,
  errorDbExistingId,
  errorDuplicateId,
  requiredRows,
  isErrorMinimumRow,
}) {
  const fields = [
    {
      id: "legacyPdfId",
      label: "Legacy Pdf ID",
      isRequired: true,
      colSpan: 4,
    },
    {
      id: "maxChars",
      label: "Max Chars",
      isNumeric: true,
      colSpan: 3,
    },
    {
      id: "groupName",
      label: "Group Name",
      colSpan: 4,
    },
    {
      id: "sharingRule",
      label: "Sharing Rule",
      isSelect: true,
      selects: [
        "Not a Shared Input",
        "Combine Responses",
        "Move to Notes Page",
        "Ignore / overwrite",
        "YES overwrites NO",
      ],
      colSpan: 4,
    },
  ];

  function isRequired(isRequired) {
    return typeof isRequired === "undefined" ? false : isRequired;
  }

  function getMaxRows() {
    let arrList = [];

    for (let i = 0; i < maxRows; i++) {
      arrList.push(i);
    }

    return arrList;
  }

  return (
    <div className={classes.root} style={{ marginTop: "3%" }}>
      <Grid container spacing={0}>
        {getMaxRows().map((arrProp, arrKey) => {
          return (
            <Grid
              container
              item
              xs={12}
              spacing={8}
              style={{ marginLeft: "2%" }}
              key={arrKey}
            >
              {fields.map((prop, key) => {
                const isGroupNameColumn = key === 2;

                const isTypeofSharingRule = key === 3 && isMultiInput === true;

                const isFirstColumn = key === 0;

                const isDisabled = isGroupNameColumn && isMultiInput === false;

                const background = isDisabled
                  ? {
                      background: "#80808017",
                    }
                  : {};

                if (isGroupNameColumn === true && isMultiInput === false) {
                  return <span />;
                }

                if (isTypeofSharingRule) {
                  return <span />;
                }

                const rowColumnId = arrKey.toString() + key.toString();

                const rowObject = rowValues[rowColumnId];

                const {
                  hasErrorText,
                  hasMinimumRowError,
                  hasDuplicateError,
                  hasErrorRow,
                } = GetErrorValues(
                  rowValues,
                  arrKey,
                  errorDbExistingId,
                  isGroupNameColumn,
                  isErrorMinimumRow,
                  errorDuplicateId
                );

                const isRequiredInput =
                  typeof requiredRows[rowColumnId] !== "undefined";

                const isSelect = typeof prop.isSelect !== "undefined";

                return (
                  <React.Fragment key={key}>
                    <Grid item xs={prop.colSpan}>
                      <TextField
                        id={`${prop.id}-${key}-${arrKey}`}
                        label={isDisabled ? " " : prop.label}
                        style={{ marginTop: "0px", ...background }}
                        name={`${prop.id}-${key}-${arrKey}`}
                        error={
                          hasErrorRow ||
                          isRequiredInput ||
                          (hasDuplicateError && isFirstColumn)
                        }
                        required={isRequired(prop.isRequired)}
                        value={
                          typeof rowObject === "undefined"
                            ? isSelect
                              ? 0
                              : ""
                            : rowObject.value
                        }
                        // disabled={typeof prop.disabled !== "undefined"}
                        type={
                          typeof prop.isNumeric === "undefined"
                            ? "text"
                            : "number"
                        }
                        select={isSelect}
                        margin="dense"
                        variant="standard"
                        disabled={isDisabled}
                        onChange={(event) => inputRow(event, arrKey, key)}
                        helperText={isRequiredInput ? "Required" : ""}
                      >
                        {isSelect
                          ? prop.selects.map((selectProp, selectKey) => {
                              return (
                                <MenuItem key={selectKey} value={selectKey}>
                                  {selectProp}
                                </MenuItem>
                              );
                            })
                          : {}}
                      </TextField>
                    </Grid>
                    {((keyIndex) => {
                      if (keyIndex > 1) {
                        return (
                          <Grid item xs={1}>
                            <Tooltip title={"Delete"} placement={"left"}>
                              <IconButton
                                color={"default"}
                                style={{
                                  marginTop: "10%",
                                }}
                                aria-label="Delete"
                                onClick={() => inputDelete(arrKey)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        );
                      }

                      return <span />;
                    })(key)}
                    {ErrorElements(
                      hasErrorText,
                      hasMinimumRowError,
                      hasDuplicateError && isGroupNameColumn
                    )}
                  </React.Fragment>
                );
              })}
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}

function AddAnotherInput({ isMultiInput, inputAnother }) {
  if (isMultiInput) {
    return (
      <Grid container style={{ marginLeft: "3%", marginTop: "1%" }}>
        <Grid item md={12}>
          <u style={{ cursor: "pointer" }} onClick={() => inputAnother()}>
            Add another input
          </u>
        </Grid>
      </Grid>
    );
  }

  return <div />;
}

function SharedInput({
  classes,
  data,
  onChange,
  sharingRule,
  duplicateCount,
  pdfInputId,
  sharedInputValue,
  inputType,
  inputRange,
  range,
  textFieldRange,
}) {
  let isDisabled = false;

  if (inputType === 2 /*If: Range of Inputs*/) {
    return textFieldRange(range, inputRange);
  }

  if (typeof sharingRule !== "undefined") {
    if (sharingRule.value === "1" || sharingRule.value === "2") {
      if (duplicateCount === 1) {
        isDisabled = true;
      }
    }
    if (sharingRule.value === "0") {
      isDisabled = true;
    }
  }

  if (pdfInputId === 0) {
    isDisabled = false;
  }

  if (data === null) {
    isDisabled = true;
  }

  return (
    <Grid item xs={6}>
      <TextField
        id={"sharedInput"}
        name={"sharedInput"}
        select
        margin="normal"
        label={"Shared Input"}
        fullWidth={true}
        className={classes.textField}
        value={
          typeof sharedInputValue === "undefined" ? 0 : sharedInputValue.value
        }
        onChange={(e) => onChange(e.target)}
        style={{ marginRight: "15px" }}
        disabled={isDisabled}
      >
        <MenuItem value={0}>{""}</MenuItem>
        {typeof data === "undefined" || data === null ? (
          <span />
        ) : (
          data.map((prop, key) => {
            return (
              <MenuItem value={prop.pdfInputId} key={key}>
                {prop.legacyPdfId}
              </MenuItem>
            );
          })
        )}
      </TextField>
    </Grid>
  );
}

function TypeInput({
  classes,
  type,
  inputType,
  sharedInputs,
  inputSharedInput,
  sharingRule,
  duplicateCount,
  pdfInputId,
  sharedInputValue,
  inputRange,
  range,
  textFieldRange,
}) {
  const id = "inputType";

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid
          container
          item
          xs={12}
          spacing={8}
          style={{ marginLeft: "1.5%" }}
          // key={arrKey}
        >
          <Grid item xs={6}>
            <TextField
              id={id}
              name={id}
              select
              margin="normal"
              label={"Type"}
              fullWidth={true}
              className={classes.textField}
              value={type}
              onChange={(e) => inputType(e.target)}
              style={{ marginRight: "15px" }}
            >
              <MenuItem value={1}>{"Single Input"}</MenuItem>
              <MenuItem value={2}>{"Range of Inputs"}</MenuItem>
            </TextField>
          </Grid>
          <SharedInput
            classes={classes}
            data={sharedInputs}
            onChange={inputSharedInput}
            sharingRule={sharingRule}
            duplicateCount={duplicateCount}
            pdfInputId={pdfInputId}
            sharedInputValue={sharedInputValue}
            inputType={type}
            inputRange={inputRange}
            range={range}
            textFieldRange={textFieldRange}
          />
        </Grid>
      </Grid>
    </div>
  );
}

function RangeParentPdf({
  classes,
  isMultiInput,
  requiredFields,
  rangeParentPdfInput,
  inputRangeParentPdf,
  toggleDeleteDialog,
  originalRangeParentPdfInput,
  errorConflictLegacyId,
}) {
  if (isMultiInput) {
    const errorMessageConflictLegacyId =
      "A PDF Input with that name already exists for this Form Version";

    return (
      <div className={classes.root}>
        <Grid container>
          <Grid
            container
            item
            xs={12}
            spacing={8}
            style={{ marginLeft: "3%" }}
            // key={arrKey}
          >
            <Grid item xs={6}>
              <TextField
                id={"parentPdfInput"}
                label={"Parent PDF Input - Legacy ID"}
                fullWidth={true}
                name={"parentPdfInput"}
                margin="normal"
                onChange={(event) => inputRangeParentPdf(event)}
                value={rangeParentPdfInput}
                required={originalRangeParentPdfInput}
                style={{
                  fontWeight: "bold",
                }}
                error={
                  requiredFields.rangeParentPdfInput || errorConflictLegacyId
                }
                helperText={
                  (requiredFields.rangeParentPdfInput ? "Required" : "") ||
                  (errorConflictLegacyId ? errorMessageConflictLegacyId : "")
                }
              />
            </Grid>
            {originalRangeParentPdfInput === null ? (
              <span />
            ) : (
              <Grid item xs={6}>
                <Tooltip title={"Delete"} placement={"right"}>
                  <IconButton
                    color={"default"}
                    style={{
                      marginTop: "10%",
                    }}
                    onClick={() =>
                      toggleDeleteDialog(originalRangeParentPdfInput)
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            )}
          </Grid>
        </Grid>
      </div>
    );
  }

  return <span />;
}

function RangeInput({
  classes,
  isMultiInput,
  inputRange,
  rangeId,
  range,
  rangeName,
  sectionRangeNames,
  inputRangeName,
  inputSelectRangeName,
  requiredFields,
  type,
  textFieldRange,
  inputRangeFlag,
  rangeFlag,
  maxAdults,
  maxClient,
}) {
  if (isMultiInput) {
    const rangeById = _.first(
      _.filter(sectionRangeNames, { pdfInputRangeId: rangeId })
    );

    return (
      <div className={classes.root}>
        <Grid container>
          <Grid
            container
            item
            xs={12}
            spacing={8}
            style={{ marginLeft: "3%" }}
            // key={arrKey}
          >
            {type === 2 /*Range of Inputs*/ ? (
              <span />
            ) : (
              textFieldRange(range, inputRange)
            )}
            <Grid item xs={6}>
              {range === 2 /*Existing*/ &&
              typeof sectionRangeNames !== "undefined" ? (
                <TextField
                  id={"rangeName"}
                  label={"Range Name"}
                  fullWidth={true}
                  name={"rangeName"}
                  margin="normal"
                  onChange={(event) => inputSelectRangeName(event)}
                  select
                  value={typeof rangeId === "undefined" ? 0 : rangeId}
                  style={{
                    fontWeight: "bold",
                  }}
                  required={true}
                >
                  {sectionRangeNames.map((prop, key) => {
                    return (
                      <MenuItem value={prop.pdfInputRangeId} key={key}>
                        {prop.pdfInputRangeName}
                      </MenuItem>
                    );
                  })}
                </TextField>
              ) : (
                <TextField
                  id={"rangeName"}
                  label={"Range Name"}
                  fullWidth={true}
                  name={"rangeName"}
                  margin="normal"
                  onChange={(event) => inputRangeName(event)}
                  value={rangeName}
                  style={{
                    fontWeight: "bold",
                  }}
                  error={requiredFields.rangeName}
                  helperText={requiredFields.rangeName ? "Required" : ""}
                />
              )}
            </Grid>
            {maxClient === null && maxAdults === null ? (
              <span />
            ) : (
              <Grid item xs={6}>
                <TextField
                  id={"rangeFlag"}
                  label={"Range Flag"}
                  fullWidth={true}
                  name={"rangeFlag"}
                  margin="normal"
                  onChange={(event) => inputRangeFlag(event)}
                  select
                  value={
                    typeof rangeFlag === "undefined"
                      ? typeof rangeById === "undefined"
                        ? 1
                        : rangeById.pdfInputRangeFlag ?? 1
                      : rangeFlag
                  }
                  style={{
                    fontWeight: "bold",
                    marginLeft: "1%",
                  }}
                  disabled={parseInt(maxAdults) < 2 || parseInt(maxClient) < 2}
                  required={true}
                >
                  <MenuItem value={1}>{"Per Client"}</MenuItem>
                  <MenuItem value={2}>{"Per Form (Multiple Clients)"}</MenuItem>
                </TextField>
              </Grid>
            )}
          </Grid>
        </Grid>
      </div>
    );
  }

  return <span />;
}

class LegacyPdfDialog extends Component {
  state = {
    input: {
      type: 1,
      rows: {},
      range: 0,
      rangeName: "",
      rangeFlag: 1 /*Per Client*/,
      isFetched: false,
    },
    maxRows: 1,
    data: {},
    showSuccessAlert: false,
    required: {
      rangeName: false,
      rows: {},
    },
    confirmDialog: {
      isOpen: false,
      message: "",
    },
    confirmDeleteParentPdf: {
      isOpen: false,
      message: "",
    },
    alertErrorMessage: "",
    showErrorAlert: false,
    errorConflictLegacyId: false,
    showProgress: false,
  };

  actions = {
    setSharedInput: (pdfInputId) => {
      this.setState((state) => {
        return {
          ...state,
          sharedInputValue: {
            value: pdfInputId,
          },
        };
      });
    },
    setCoreDetails: (response) => {
      if (response === "") {
        this.setState((state) => {
          return {
            ...state,
            input: {
              ...state.input,
              isFetched: true,
            },
          };
        });

        return;
      }

      const {
        type,
        rangeNames,
        pdfInputId,
        pdfInputRangeId,
        rows,
        linkedQuestionsCount,
        sharedInputs,
        pdfInputIdDuplicateCount,
        rangeParentPdfInput,
      } = response;

      const { newRows, rowsCount } = this.actions.createRows(rows);

      response.rows = newRows;

      const sharedInputValue = _.find(sharedInputs, { pdfInputId: pdfInputId });

      this.setState((state) => {
        return {
          ...state,
          input: {
            ...response,
            range: type === 2 ? 2 : 0,
            sectionRangeNames: rangeNames,
            isFetched: true,
          },
          maxRows: type === 1 ? 1 : rowsCount / 3,
          pdfInputId: pdfInputId,
          pdfInputRangeId: pdfInputRangeId,
          originalType: type,
          originalSingleLegacyPdfId:
            _.isEmpty(newRows) === true ? null : newRows["00"].value,
          linkedQuestionsCount: linkedQuestionsCount,
          sharedInputs: sharedInputs,
          pdfInputIdDuplicateCount: pdfInputIdDuplicateCount,
          sharedInputValue: {
            value: typeof sharedInputValue === "undefined" ? null : pdfInputId,
          },
          rangeParentPdfInput: rangeParentPdfInput,
          originalRangeParentPdfInput: rangeParentPdfInput,
          rangeFlag: type,
        };
      });
    },
    getLegacyPdfIdByPdfInputId: (pdfInputId) => {
      this.api.getLegacyPdfIdByPdfInputId(pdfInputId);
    },
    saveInputsForLaterUse: (inputs) => {
      this.setState((state) => {
        return {
          ...state,
          savingInputs: inputs,
        };
      });
    },
    validate: {
      checkExistingPdfInputSameLegacyPdfId: (
        pdfInputRangeId,
        rangeParentPdfInput
      ) => {
        this.api.checkExistingPdfInputSameLegacyPdfId(
          pdfInputRangeId,
          rangeParentPdfInput
        );
      },
      checkRequiredRangeParentPdf: (
        rangeParentPdfInput,
        originalRangeParentPdfInput
      ) => {
        const setRequiredInputs = (isEmpty) => {
          this.setState((state) => {
            return {
              ...state,
              required: {
                ...state.required,
                rangeParentPdfInput: isEmpty,
              },
            };
          });
        };

        if (originalRangeParentPdfInput === null) {
          return false;
        }

        if (rangeParentPdfInput.replace(/\s+/g, "") === "") {
          setRequiredInputs(true);
          return true;
        }
        setRequiredInputs(false);

        return false;
      },
      checkRequiredInputs: (range, rangeName, type) => {
        const setRequiredInputs = (isEmpty) => {
          this.setState((state) => {
            return {
              ...state,
              required: {
                ...state.required,
                rangeName: isEmpty,
              },
            };
          });
        };

        if (
          (rangeName === "" || typeof rangeName === "undefined") &&
          type === 2 &&
          (range === 0 || range === 1)
        ) {
          setRequiredInputs(true);

          return true;
        }

        setRequiredInputs(false);

        return false;
      },
      checkRequiredRows: (rows, type) => {
        const requiredRows = { count: 0 };

        const incrementCount = () => {
          requiredRows.count =
            typeof requiredRows.count === "undefined"
              ? 1
              : requiredRows.count + 1;
        };

        const checkDefaultRows = (id) => {
          //INFO: Do not check Row #2 if it 'Single' Type
          if (id === "10" && type === 1) {
            return;
          }

          if (typeof rows[id] === "undefined") {
            requiredRows[id] = { required: true };

            incrementCount();
          }
        };

        for (let [key, value] of Object.entries(_.cloneDeep(rows))) {
          if (value.column === 0) {
            if (
              value.value === null ||
              value.value === "" ||
              value.value === "0"
            ) {
              requiredRows[key] = { required: true };

              incrementCount();
            }
          }
        }

        checkDefaultRows("00") /*Row #1*/;

        checkDefaultRows("10") /*Row #2*/;

        if (requiredRows.count > 0) {
          this.setState((state) => {
            return {
              ...state,
              required: {
                ...state.required,
                rows: requiredRows,
              },
            };
          });
        }

        return requiredRows.count;
      },
      checkDuplicate: (rows, legacyPdfIds, check) => {
        const duplicate = check(rows, legacyPdfIds);

        if (typeof duplicate.id !== "undefined") {
          this.setState((state) => {
            return {
              ...state,
              input: {
                ...state.input,
                errorDuplicateId: duplicate.id,
              },
            };
          });

          return true;
        }

        return false;
      },
      checkMinimumRow: (maxRows, type) => {
        if (maxRows === 1 && type === 2) {
          this.setState((state) => {
            return {
              ...state,
              input: {
                ...state.input,
                errorMinimumRow: true,
              },
            };
          });

          return true;
        }

        return false;
      },
      clearAll: () => {
        this.setState((state) => {
          return {
            ...state,
            input: {
              type: 1,
              rows: {},
              range: 0,
              rangeName: "",
              isFetched: false,
            },
            required: {
              rangeName: false,
              rows: {},
            },
            confirmDialog: {
              ...state.confirmDialog,
              isOpen: false,
            },
            errorConflictLegacyId: false,
            savingInputs: {},
          };
        });
      },
    },
    changeOfType: (selectedType) => {
      const dummy = this.actions.createDummyObject();
      this.setState((state) => {
        return {
          ...state,
          input: {
            ...state.input,
            type: selectedType,
            rows: { ...dummy },
          },
          maxRows: selectedType,
        };
      });
    },
    manageRowValue: (value, column) => {
      const subStringManager = {
        substringFromRight: (stringValue, length) => {
          return stringValue.substr(stringValue.length - length, length);
        },
        substringFromLeft: (stringValue, length) => {
          return stringValue.substr(0, stringValue.length - length);
        },
        incrementSubstring: (wholeValue, subValue, length) => {
          const hasLeadingZero = () => {
            return parseInt(wholeValue.substr(wholeValue.length - 2, 1)) === 0;
          };

          let rowValue = `${subStringManager.substringFromLeft(
            wholeValue,
            length
          )}`;

          rowValue += `${
            parseInt(subValue) + 1 /*increment by one(1)*/
          }`.padStart(hasLeadingZero() === true ? 2 : 1, "0");

          return rowValue;
        },
      };

      let rowValue = "";

      if (column === "1" /*Exclude 'MaxChar' column*/) {
        return value;
      } else {
        /*If value is null or empty to avoid error*/
        if (value === null) {
          return value;
        }
        if (value.replace(/\s+/g, "") === "") {
          return null;
        }

        const valueTwoIndex = subStringManager.substringFromRight(value, 2);

        if (
          Number.isInteger(parseInt(valueTwoIndex)) === true /*If 10 and above*/
        ) {
          rowValue = subStringManager.incrementSubstring(
            value,
            valueTwoIndex,
            2
          );
        } /*If 9 and below*/ else {
          const valueOneIndex = subStringManager.substringFromRight(value, 1);

          if (Number.isInteger(parseInt(valueOneIndex)) === true) {
            rowValue = subStringManager.incrementSubstring(
              value,
              valueOneIndex,
              1
            );
          }
        }

        if (rowValue === "") {
          return null;
        }

        return rowValue;
      }
    },
    onChange: {
      inputType: (event) => {
        const {
          input,
          pdfInputId,
          pdfInputRangeId,

          originalType,
          originalSingleLegacyPdfId: singleLegacyPdfId,
          linkedQuestionsCount,
        } = this.state;

        const { onClick } = this.actions;

        const { rangeName } = input;

        const selectedType = event.value;

        const isFromMultiToSingleType =
          typeof pdfInputId === "undefined" &&
          typeof pdfInputRangeId !== "undefined";

        //INFO: Prevent orphaned records (on change of 'Type')
        //Check if no existing records.
        if (typeof originalType !== "undefined") {
          if (
            (typeof pdfInputId !== "undefined" && pdfInputId > 0) ||
            isFromMultiToSingleType === true
          ) {
            if (originalType !== selectedType) {
              onClick.confirmDialog.toggle(
                selectedType,
                singleLegacyPdfId,
                rangeName,
                linkedQuestionsCount
              );

              return;
            }
          }
        }

        this.actions.changeOfType(selectedType);
      },
      inputRow: (event, row, column) => {
        const value = event.target.value;

        //Remove 'Required' text if already filled.
        if (value !== "") {
          delete this.state.required.rows[`${row}${column}`];
        }

        const uniqueId = row.toString() + column.toString();

        const byId = this.state.input.rows[uniqueId];

        let pdfInputId = 0;

        if (typeof byId !== "undefined") {
          if (typeof byId.pdfInputId !== "undefined") {
            pdfInputId = byId.pdfInputId;
          }
        }

        this.setState((state) => {
          return {
            ...state,
            input: {
              ...state.input,
              rows: {
                ...state.input.rows,
                [uniqueId]: {
                  row: row,
                  column: column,
                  value: value,
                  pdfInputId: pdfInputId,
                },
              },
              errorLegacyPdfId: "",
              errorDuplicateId: "",
            },
          };
        });
      },
      inputRange: (event) => {
        if (event.target.value === 1) {
          this.actions.inputsNewRange(event);

          return;
        }

        this.api.getRangeNames(event);
      },
      inputRangeName: (event) => {
        const value = event.target.value;

        this.setState((state) => {
          return {
            ...state,
            input: {
              ...state.input,
              rangeName: value,
            },
          };
        });
      },
      inputSelectRangeName: (event) => {
        this.api.getRangePdfRows(event.target.value);
      },
      inputRangeFlag: (event) => {
        const value = event.target.value;

        this.setState((state) => {
          return {
            ...state,
            input: {
              ...state.input,
              rangeFlag: value,
            },
          };
        });
      },
      inputRangeParentPdf: (event) => {
        const value = event.target.value;

        this.setState((state) => {
          return {
            ...state,
            rangeParentPdfInput: value,
          };
        });
      },
    },
    onClick: {
      confirmDeleteParentPdfDialog: {
        toggle: (legacyPdfId) => {
          this.setState((state) => {
            return {
              ...state,
              confirmDeleteParentPdf: {
                ...state.confirmDeleteParentPdf,
                isOpen: !state.confirmDeleteParentPdf.isOpen,
                message: `Are you sure want to delete '${
                  typeof legacyPdfId === "undefined" ? "" : legacyPdfId
                }' ?`,
              },
            };
          });
        },
        confirmYes: () => {
          this.setState((state) => {
            return {
              ...state,
              rangeParentPdfInput: "",
              originalRangeParentPdfInput: null,
            };
          });

          this.actions.onClick.confirmDeleteParentPdfDialog.toggle();
        },
      },
      confirmDialog: {
        toggle: (type, legacyPdfId, rangeName, linkedQuestionsCount) => {
          let title = "";
          let name = "";

          //Execute only if there is 'more than one(1)' legacy range
          // associated questions
          if (type === 1 /*To Single*/ && linkedQuestionsCount > 1) {
            this.actions.changeOfType(type);

            return;
          }

          if (type === 1 /*To Single*/ && linkedQuestionsCount === 1) {
            title = "Single Input";
            name = rangeName;
          }

          if (type === 2 /*To Range*/) {
            title = "Range of Inputs";
            name = legacyPdfId;
          }

          const message = `Are you sure want to change to '${title}'? The PDF Input '${name}' will be deleted.`;

          this.setState((state) => {
            return {
              ...state,
              confirmDialog: {
                ...state.confirmDialog,
                isOpen: !state.confirmDialog.isOpen,
                message: message,
                selectedType: type,
              },
            };
          });
        },
        confirmYes: () => {
          const { changeOfType, onClick } = this.actions;

          changeOfType(this.state.confirmDialog.selectedType);

          onClick.confirmDialog.toggle();
        },
      },
      inputAnother: () => {
        const lastRow = this.state.maxRows;

        const rowIndex = lastRow.toString();

        const append = (lastRw, rowIdx, column, clonedRows) => {
          const filteredClonedRows =
            clonedRows[`${lastRow - 1 /*previous row*/}${column}`];
          if (typeof filteredClonedRows === "undefined") {
            return;
          }

          const { value } = clonedRows[
            `${lastRow - 1 /*previous row*/}${column}`
          ];

          const rowValue = this.actions.manageRowValue(value, column);

          return {
            [rowIdx + column]: {
              row: lastRw,
              column: parseInt(column),
              value: rowValue,
              id: `${rowIdx}${column}`,
              pdfInputId: 0,
            },
          };
        };

        this.setState((state) => {
          const clonedRows = { ...state.input.rows };

          return {
            ...state,
            input: {
              ...state.input,
              rows: {
                ...clonedRows,
                ...append(lastRow, rowIndex, "0", clonedRows),
                ...append(lastRow, rowIndex, "1", clonedRows),
                ...append(lastRow, rowIndex, "2", clonedRows),
              },
            },
            maxRows: lastRow + 1,
          };
        });
      },
      inputSave: () => {
        const {
          input,
          pdfInputId,
          pdfInputRangeId,
          maxRows,
          originalType,
          sharedInputValue,
          rangeParentPdfInput,
          originalRangeParentPdfInput,
        } = this.state;

        const { rows, type, range, rangeName, rangeFlag } = input;

        const { duplicate, validate, convertRowsToArray } = this.actions;

        const { items, check } = duplicate;

        let legacyPdfIds = items(rows);

        const {
          checkDuplicate,
          checkRequiredRows,
          checkRequiredInputs,
          checkMinimumRow,
          checkRequiredRangeParentPdf,
          checkExistingPdfInputSameLegacyPdfId,
        } = validate;

        const errorDuplicate = checkDuplicate(rows, legacyPdfIds, check);

        const errorRequiredCount = checkRequiredRows(rows, type);

        const inputErrorCount = checkRequiredInputs(range, rangeName, type);

        checkExistingPdfInputSameLegacyPdfId(
          pdfInputRangeId,
          rangeParentPdfInput
        );

        const rangeParentPdf = checkRequiredRangeParentPdf(
          rangeParentPdfInput,
          originalRangeParentPdfInput
        );

        const errorMinimumRow = checkMinimumRow(maxRows, type);

        if (
          errorRequiredCount > 0 ||
          inputErrorCount === true ||
          errorDuplicate === true ||
          errorMinimumRow === true ||
          rangeParentPdf === true
        ) {
          return;
        }

        const arrRows = convertRowsToArray(rows);

        const sharedValue =
          typeof sharedInputValue === "undefined" ? 0 : sharedInputValue.value;

        const inputs = {
          type: type,
          range: range,
          rangeName: rangeName,
          rangeFlag: rangeFlag,
          rows: arrRows,
          questionId: commonAction.getQuestionId(),
          formVersionId: this.props.formVersionId,
          pdfInputId: pdfInputId,
          pdfInputRangeId: pdfInputRangeId,
          originalType: originalType,
          sharedInputValue: sharedValue,
          rangeParentPdfInput: rangeParentPdfInput,
          originalRangeParentPdfInput: originalRangeParentPdfInput,
        };
        this.actions.saveInputsForLaterUse(inputs);
      },
      inputSharedInput: (event) => {
        const pdfInputId = event.value;

        if (pdfInputId === 0) {
          this.setState((state) => {
            return {
              ...state,
              maxRows: 1,
              originalSingleLegacyPdfId: null,
              input: {
                ...state.input,
                rows: _.isEmpty(state.input.rows)
                  ? {}
                  : { ...state.input.rows },
              },
            };
          });

          this.actions.setSharedInput(pdfInputId);

          return;
        }

        this.actions.getLegacyPdfIdByPdfInputId(event.value);
      },
      inputDelete: (row) => {
        const stateRows = this.state.input.rows;

        //INFO: If the user is trying to delete an empty row #1.
        if (_.isEmpty(stateRows) === true) {
          return;
        }

        const size = _.size(stateRows);

        //INFO: If 1st row and only contains 1 row.
        if ((size === 2 || size === 3) && row === 0) {
          this.actions.detachLegacyPdfRecord();

          return;
        }

        const steps = {
          deleteFromState: () => {
            let newRows = {};

            for (let [key, value] of Object.entries(stateRows)) {
              if (value.row !== row) {
                newRows[key.toString()] = value;
              }
            }
            ///////////////////////////////////////////////////////////////////

            const sortedRows = _.orderBy(newRows, ["row"], ["asc"]);

            let latestRows = {};

            for (let [key, value] of Object.entries(sortedRows)) {
              const newRowValue = value.row > row ? value.row - 1 : value.row;

              latestRows[newRowValue.toString() + value.column] = {
                row: newRowValue,
                column: value.column,
                value: value.value,
                key: key,
                pdfInputId: value.pdfInputId,
              };
            }
            ///////////////////////////////////////////////////////////////////

            this.setState((state) => {
              return {
                ...state,
                input: {
                  ...state.input,
                  rows: {
                    ...latestRows,
                  },
                },
                maxRows: state.maxRows - 1,
              };
            });
          },
          refreshRowIndexes: () => {},
        };

        steps.deleteFromState();

        window.setTimeout(steps.refreshRowIndexes, 300);
      },
    },
    getAuthHeader: () => {
      const jwt = `Bearer ${localStorage.getItem("jwtToken")}`;

      return jwt;
    },
    duplicate: {
      items: (rows) => {
        let legacyPdfIds = [];

        for (let [key, value] of Object.entries(_.cloneDeep(rows))) {
          value.id = key;

          if (value.column === 0 && value.value !== null) {
            legacyPdfIds.push({ id: value.value });
          }
        }

        return legacyPdfIds;
      },
      check: (rows, items) => {
        let hasDuplicate = {};

        items.forEach(function (value) {
          const filtered = _.filter(items, value);

          if (filtered.length > 1 && typeof hasDuplicate.id === "undefined") {
            hasDuplicate = value;
          }
        });

        return hasDuplicate;
      },
    },
    setErrorIfAny: (result) => {
      const { errorId, errorLegacyPdfId, errorMessage } = result.data;

      if (errorId === null) {
        const _that = this;

        this.props.cancel();

        this.actions.showAlert();

        _.delay(function () {
          _that.actions.validate.clearAll();
        }, 200);

        _.delay(function () {
          _that.props.setLegacyPdfSettingTextLabel();
        }, 900);
      } else {
        if (errorId === 333) {
          this.actions.showErrorAlert(errorMessage);
        }

        this.setState((state) => {
          return {
            ...state,
            input: {
              ...state.input,
              errorLegacyPdfId: errorLegacyPdfId,
            },
            confirmDialog: {
              ...state.confirmDialog,
              isOpen: false,
            },
            showProgress: false,
          };
        });
      }
    },
    createRows: (rows) => {
      let newRows = {};

      let rowsCount = 0;

      if (rows === null) {
        return {
          newRows,
          rowsCount,
        };
      }

      rows.forEach(function (row) {
        newRows[row.id] = row;
        rowsCount++;
      });

      return {
        newRows,
        rowsCount,
      };
    },
    detachLegacyPdfRecord: () => {
      const inputs = {
        type: 2,
        questionId: commonAction.getQuestionId(),
        formVersionId: this.props.formVersionId,
        pdfInputRangeId: -1,
      };

      this.api.save(inputs);
    },
    inputsNewRange: (event) => {
      delete this.state.pdfInputId;

      delete this.state.pdfInputRangeId;

      const dummy = this.actions.createDummyObject();

      this.setState(() => {
        return {
          data: {},
          input: {
            range: event.target.value,
            rangeName: "",
            rows: { ...dummy },
            type: 2,
          },
          maxRows: 2,
        };
      });
    },
    showAlert: () => {
      this.setState((state) => {
        return {
          ...state,
          showSuccessAlert: true,
          showProgress: false,
        };
      });

      let timer;

      const _that = this;

      this.showThenHideAlert = () => {
        window.clearTimeout(timer);

        timer = window.setTimeout(function () {
          _that.setState((state) => {
            return {
              ...state,
              showSuccessAlert: false,
            };
          });
        }, 1000);
      };

      this.showThenHideAlert();
    },
    showErrorAlert: (errorMessage) => {
      this.setState((state) => {
        return {
          ...state,
          showErrorAlert: true,
          alertErrorMessage: errorMessage,
        };
      });

      let timer;

      const _that = this;

      this.showThenHideAlert = () => {
        window.clearTimeout(timer);

        timer = window.setTimeout(function () {
          _that.setState((state) => {
            return {
              ...state,
              showErrorAlert: false,
            };
          });
        }, 5000);
      };

      this.showThenHideAlert();
    },
    createDummyObject: () => {
      const { insertDummy } = this.actions;

      return {
        ...insertDummy("00", 0, 0),
        ...insertDummy("01", 0, 1),
        ...insertDummy("10", 1, 0),
        ...insertDummy("11", 1, 1),
      };
    },
    insertDummy: () => (id, row, column) => {
      return {
        [id]: {
          row: row,
          column: column,
          value: null,
          id: "00",
          pdfInputId: 0,
        },
      };
    },
    convertRowsToArray: (rows) => {
      const arrRows = [];

      for (let [key, value] of Object.entries(_.cloneDeep(rows))) {
        value.id = key;

        arrRows.push(value);
      }

      return arrRows;
    },
  };

  api = {
    checkExistingPdfInputSameLegacyPdfId: (
      pdfInputRangeId,
      rangeParentPdfInput
    ) => {
      const headers = this.actions.getAuthHeader();

      const { sectionId, questionId } = this.api.getIds();

      const formVersionId = this.props.formVersionId;

      api
        .get()
        .getPdfRangeByParentPdfInput(
          formVersionId,
          headers,
          sectionId,
          questionId,
          pdfInputRangeId,
          rangeParentPdfInput
        )
        .then((result) => {
          if (result === "") {
            this.api.save(this.state.savingInputs);
          } else {
            this.setState((state) => {
              return {
                ...state,
                errorConflictLegacyId: true,
              };
            });
          }
        });
    },
    getLegacyPdfIdByPdfInputId: (pdfInputId) => {
      const headers = this.actions.getAuthHeader();

      const sectionId = commonAction.getSectionId();

      api
        .get()
        .getlegacyPdfIdByPdfInputId(headers, sectionId, pdfInputId)
        .then((result) => {
          this.actions.setCoreDetails(result);

          this.actions.setSharedInput(pdfInputId);
        });
    },
    save: (inputs) => {
      this.setState((state) => {
        return {
          ...state,
          showProgress: true,
        };
      });

      api
        .update()
        .legacyPdfSettingsByQuestionId(
          this.actions.getAuthHeader(),
          inputs,
          commonAction.getQuestionId()
        )
        .then((result) => {
          this.actions.setErrorIfAny(result);
        });
    },
    getIds: () => {
      const questionId = commonAction.getQuestionId();

      const sectionId = commonAction.getSectionId();

      return {
        questionId,
        sectionId,
      };
    },
    getDetails: () => {
      const { questionId, sectionId } = this.api.getIds();

      const formVersionId = this.props.formVersionId;

      api
        .get()
        .getLegacyPdfSettingsByQuestionId(
          this.actions.getAuthHeader(),
          questionId,
          sectionId,
          formVersionId
        )
        .then((response) => {
          this.actions.setCoreDetails(response);
        });
    },
    getRangeNames: (event) => {
      const { sectionId } = this.api.getIds();

      const formVersionId = this.props.formVersionId;

      api
        .get()
        .getLegacyPdfSettingsRangeNames(
          this.actions.getAuthHeader(),
          sectionId,
          formVersionId
        )
        .then((rangeNames) => {
          const dummy = this.actions.createDummyObject();

          this.setState((state) => {
            return {
              ...state,
              input: {
                ...state.input,
                range: event.target.value,
                sectionRangeNames: [...rangeNames],
                rows: { ...dummy },
                history: {
                  ...state.input.history,
                  rows: { ...state.input.rows },
                },
              },
              maxRows: 2,
            };
          });
        });
    },
    getRangePdfRows: (pdfRangeId) => {
      const { questionId, sectionId } = this.api.getIds();

      api
        .get()
        .getLegacyPdfSettingsByRangeId(
          this.actions.getAuthHeader(),
          sectionId,
          questionId,
          pdfRangeId
        )
        .then((response) => {
          if (response === "") {
            const dummy = this.actions.createDummyObject();

            this.setState((state) => {
              return {
                ...state,
                input: {
                  ...state.input,
                  rows: { ...dummy },
                },
                maxRows: 2,
                pdfInputRangeId: pdfRangeId,
              };
            });

            return;
          }

          const { newRows, rowsCount } = this.actions.createRows(response);

          this.setState((state) => {
            return {
              ...state,
              input: {
                ...state.input,
                rows: newRows,
              },
              maxRows: rowsCount / 3,
              pdfInputRangeId: pdfRangeId,
            };
          });
        });
    },
  };

  render() {
    const {
      isOpen,
      cancel,
      classes,
      incrementalKey,
      maxAdults,
      maxClient,
    } = this.props;

    const { onChange, onClick, validate } = this.actions;

    const {
      inputType,
      inputRow,
      inputRange,
      inputRangeName,
      inputSelectRangeName,
      inputRangeFlag,
      inputRangeParentPdf,
    } = onChange;

    const { inputAnother, inputSave, inputDelete, inputSharedInput } = onClick;

    const {
      pdfInputRangeId,
      input,
      showSuccessAlert,
      maxRows,
      required,
      confirmDialog,
      confirmDeleteParentPdf,
      sharedInputs,
      pdfInputIdDuplicateCount,
      sharedInputValue,
      rangeParentPdfInput,
      originalRangeParentPdfInput,
      errorConflictLegacyId,
    } = this.state;

    const { isOpen: dialogIsOpen, message } = confirmDialog;

    const {
      isOpen: dialogDeleteParentPdfIsOpen,
      message: parentPdfDialogMessage,
    } = confirmDeleteParentPdf;

    const { toggle: toggleConfirmDialog, confirmYes } = onClick.confirmDialog;

    const {
      toggle: toggleConfirmDeleteParentPdfDialog,
      confirmYes: confirmYesDeleteParentPdfDialog,
    } = onClick.confirmDeleteParentPdfDialog;

    const {
      type,
      rows,
      range,
      rangeName,
      sectionRangeNames,
      errorLegacyPdfId,
      errorDuplicateId,
      errorMinimumRow,
      isFetched,
      pdfInputId,
      rangeFlag,
    } = input;

    const isMultiInput = type > 1;

    //serves like a 'componentDidMount'
    if (isOpen === true && isFetched === false) {
      this.api.getDetails();
    }

    const textFieldRange = (range, inputRange) => {
      const value = typeof range === "undefined" ? 1 : range === 0 ? 1 : range;

      return (
        <Grid item xs={6}>
          <TextField
            key={incrementalKey}
            id={"range"}
            label={"Range"}
            select
            fullWidth={true}
            name={"range"}
            value={value}
            margin="normal"
            onChange={(event) => inputRange(event)}
            style={{
              fontWeight: "bold",
              marginLeft: "3%",
            }}
          >
            <MenuItem value={1}>{"New Range"}</MenuItem>
            <MenuItem value={2}>{"Existing Range"}</MenuItem>
          </TextField>
        </Grid>
      );
    };

    const ShowProgress = () => {
      if (isFetched === false) {
        return (
          <LinearProgress
            classes={{
              colorPrimary: classes.colorPrimary,
              barColorPrimary: classes.barColorPrimary,
            }}
          />
        );
      }

      return <span />;
    };

    return (
      <div>
        <Dialog
          open={isOpen}
          maxWidth={"sm"}
          fullWidth={true}
          onBackdropClick={() => {
            cancel();
            validate.clearAll();
          }}
        >
          <DialogTitle>{"Legacy PDF Settings"}</DialogTitle>
          {this.state.showProgress ? (
            <LinearProgress
              classes={{
                colorPrimary: classes.colorPrimary,
                barColorPrimary: classes.barColorPrimary,
              }}
            />
          ) : (
            <span />
          )}
          <DialogContent>
            <TypeInput
              classes={classes}
              type={type}
              inputType={inputType}
              sharedInputs={sharedInputs}
              sharedInputValue={sharedInputValue}
              inputSharedInput={inputSharedInput}
              sharingRule={input.rows["03"]}
              duplicateCount={pdfInputIdDuplicateCount}
              pdfInputId={pdfInputId}
              inputRange={inputRange}
              range={range}
              textFieldRange={textFieldRange}
            />
            <RangeInput
              classes={classes}
              isMultiInput={isMultiInput}
              inputRange={inputRange}
              rangeId={pdfInputRangeId}
              range={range}
              rangeName={rangeName}
              inputRangeName={inputRangeName}
              sectionRangeNames={sectionRangeNames}
              inputSelectRangeName={inputSelectRangeName}
              requiredFields={required}
              type={type}
              textFieldRange={textFieldRange}
              inputRangeFlag={inputRangeFlag}
              rangeFlag={rangeFlag}
              maxAdults={maxAdults}
              maxClient={maxClient}
            />
            <RangeParentPdf
              classes={classes}
              isMultiInput={isMultiInput}
              requiredFields={required}
              rangeParentPdfInput={rangeParentPdfInput}
              inputRangeParentPdf={inputRangeParentPdf}
              toggleDeleteDialog={toggleConfirmDeleteParentPdfDialog}
              originalRangeParentPdfInput={originalRangeParentPdfInput}
              errorConflictLegacyId={errorConflictLegacyId}
            />
            <br />
            <Divider />
            <ShowProgress />
            <RowsAndColumnsInput
              classes={classes}
              isMultiInput={isMultiInput}
              inputRow={inputRow}
              maxRows={maxRows}
              rowValues={rows}
              inputDelete={inputDelete}
              errorDbExistingId={errorLegacyPdfId}
              errorDuplicateId={errorDuplicateId}
              requiredRows={required.rows}
              isErrorMinimumRow={errorMinimumRow}
            />
            <AddAnotherInput
              isMultiInput={isMultiInput}
              inputAnother={inputAnother}
            />
          </DialogContent>
          <Divider />

          <DialogActions style={{ marginRight: "22px" }}>
            <Button
              variant="outlined"
              // style={{ marginRight: "50%" }}
              onClick={() => {
                cancel();
                validate.clearAll();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="raised"
              size="large"
              color="primary"
              className={classes.button}
              onClick={() => inputSave()}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          place="br"
          color="success"
          icon={Beenhere}
          message={
            <span>
              <b>Yes!</b> Updates saved successfully
            </span>
          }
          open={showSuccessAlert}
        />
        <Snackbar
          place="br"
          color="danger"
          icon={Cancel}
          message={this.state.alertErrorMessage}
          open={this.state.showErrorAlert}
        />
        <ConfirmDialog
          isOpen={dialogIsOpen}
          close={toggleConfirmDialog}
          message={message}
          confirm={confirmYes}
        />
        <ConfirmDialog
          isOpen={dialogDeleteParentPdfIsOpen}
          close={toggleConfirmDeleteParentPdfDialog}
          message={parentPdfDialogMessage}
          confirm={confirmYesDeleteParentPdfDialog}
        />
      </div>
    );
  }
}

LegacyPdfDialog.propTypes = {
  cancel: PropTypes.func.isRequired,
  formVersionId: PropTypes.number.isRequired,
};

export default LegacyPdfDialog;
