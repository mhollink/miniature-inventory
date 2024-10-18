import {
  AlertTitle,
  Autocomplete,
  Checkbox,
  DialogActions,
  DialogContent,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import { Add } from "@mui/icons-material";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { ExternalLink } from "@components/link/ExternalLink.tsx";
import { ChangeEvent, FormEvent, MouseEvent, useState } from "react";
import allPaints from "@components/paints/data/paints.json";
import useTheme from "@mui/material/styles/useTheme";
import LoadingButton from "@mui/lab/LoadingButton";
import { Paint, selectPaintsSlice } from "@state/paints";
import { useStore } from "@state/store.ts";
import { selectModalSlice } from "@state/modal";
import { useApi } from "../../../api/useApi.ts";
import { logApiFailure, logKeyEvent } from "../../../firebase/analytics.ts";
import { Alerts } from "@components/alerts/alerts.tsx";
import { selectAlertSlice } from "@state/alert";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

type Paints = {
  [brand: string]: {
    [range: string]: {
      name: string;
      color: string; // hexcode color of the paint
    }[];
  };
};

const data: Paints = allPaints;

export const AddPaintModal = () => {
  const theme = useTheme();
  const { addPaint, ownedPaints } = useStore(selectPaintsSlice);
  const { closeModal } = useStore(selectModalSlice);
  const { triggerAlert } = useStore(selectAlertSlice);
  const api = useApi();
  const [loading, setLoading] = useState(false);

  const [brand, setBrand] = useState<string | null>("");
  const [customBrand, setCustomBrand] = useState<string | null>("");
  const [brandError, setBrandError] = useState("");

  const [range, setRange] = useState<string | null>("");
  const [rangeError, setRangeError] = useState("");

  const [color, setColor] = useState<{ name: string; color: string } | null>({
    name: "",
    color: "",
  });
  const [colorError, setColorError] = useState("");

  const [keepModalOpen, setKeepOpen] = useState(false);

  const clearErrors = () => {
    setBrandError("");
    setRangeError("");
    setColorError("");
  };

  const clearInput = () => {
    setCustomBrand("");
    setRange("");
    setColor({ name: "", color: theme.palette.primary.light });
  };

  const changeBrand = (newValue: string | null) => {
    clearErrors();
    setBrand(newValue);
    clearInput();
  };

  const changeRange = (newValue: string | null) => {
    clearErrors();
    setRange(newValue);
    setColor({ name: "", color: theme.palette.primary.light });
  };

  const validateBrand = () => {
    if (!brand?.trim() || (brand === customPaint && !customBrand?.trim())) {
      setBrandError("You must select a paint brand.");
      return false;
    }
    return true;
  };

  const validateRange = () => {
    if (!range?.trim()) {
      setRangeError("You must select a paint range.");
      return false;
    }
    return true;
  };

  const validateColor = () => {
    if (!color || !color.name) {
      setColorError("You must select a color.");
      return false;
    }
    return true;
  };

  const isSamePaint = (a: Paint) => (b: Paint) =>
    a.name === b.name && a.range === b.range && a.brand === b.brand;

  const submit = async (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    clearErrors();
    if (
      [validateBrand(), validateRange(), validateColor()].some(
        (error) => !error,
      )
    ) {
      return;
    }

    const newPaint = {
      brand: brand === customPaint ? customBrand : brand,
      color: color?.color,
      name: color?.name,
      range: range,
    } as unknown as Paint;

    if (ownedPaints.some(isSamePaint(newPaint))) {
      setColorError("You already have this exact color in your collection");
      return;
    }

    setLoading(true);

    try {
      setLoading(true);
      const { id } = await api.addPaint(newPaint);
      triggerAlert(Alerts.ADD_PAINT_SUCCESS);
      logKeyEvent("add paint");
      addPaint({ ...newPaint, id });
      if (!keepModalOpen) {
        closeModal();
      } else {
        document
          .getElementById("add-paint-range")
          ?.focus({ preventScroll: true });
      }
      clearInput();
    } catch (e) {
      triggerAlert(Alerts.ADD_PAINT_ERROR);
      logApiFailure(e, "add paint");
    } finally {
      setLoading(false);
    }
  };

  const customPaint = "Custom paint";
  const supportedBrands = Object.keys(data);

  return (
    <>
      <DialogContent>
        <Alert severity={"info"} variant={"filled"} sx={{ mb: 2 }}>
          <AlertTitle>
            <b>Supported paint brands</b>
          </AlertTitle>
          <Typography variant={"body2"}>
            Miniature Inventory currently only supports paints of the Citadel
            paint range. This is because creating the data files for all paint
            colors of range takes a lot of time. <em>Vallejo</em> and{" "}
            <em>The Army Painter</em> will be added in the near future. You can
            already add them using the <em>{customPaint}</em> option.
          </Typography>
        </Alert>

        <form onSubmit={submit}>
          <FormGroup>
            <Stack direction={"column"} spacing={2}>
              <Box>
                <Autocomplete
                  value={brand}
                  onChange={(_, newValue: string | null) => {
                    changeBrand(newValue);
                  }}
                  id="add-paint-brand"
                  options={[
                    ...supportedBrands.sort((a, b) => a.localeCompare(b)),
                    customPaint,
                  ]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Paint brand"
                      helperText={brand !== customPaint ? brandError : ""}
                      error={brand !== customPaint && !!brandError}
                    />
                  )}
                />
                <FormHelperText sx={{ px: 1 }}>
                  We currently only support paints from{" "}
                  {supportedBrands.length > 1
                    ? [...supportedBrands]
                        .splice(0, supportedBrands.length - 1)
                        .join(", ") +
                      " & " +
                      supportedBrands[supportedBrands.length - 1]
                    : supportedBrands.join(", ")}
                  . You can add a custom paint or request your preferred range
                  via{" "}
                  <ExternalLink
                    href={
                      "https://github.com/mhollink/miniature-inventory/issues/new?labels=enhancement&template=custom-issue.md&title=[New%20paint%20brand%20request]%20..."
                    }
                  >
                    Github
                  </ExternalLink>
                </FormHelperText>
              </Box>
              {brand !== customPaint ? (
                <>
                  <Autocomplete
                    value={range}
                    onChange={(_, newValue: string | null) => {
                      changeRange(newValue);
                    }}
                    id="add-paint-range"
                    options={
                      brand
                        ? Object.keys(data[brand]).sort((a, b) =>
                            a.localeCompare(b),
                          )
                        : []
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Paint range"
                        helperText={rangeError}
                        error={!!rangeError}
                      />
                    )}
                  />

                  <Autocomplete
                    value={color}
                    onChange={(
                      _,
                      newValue: { name: string; color: string } | null,
                    ) => {
                      setColor(newValue);
                    }}
                    id="add-paint-color"
                    options={
                      brand && range
                        ? data[brand][range]
                            .filter(
                              (color) =>
                                !ownedPaints.some(
                                  isSamePaint({
                                    brand,
                                    range,
                                    name: color.name,
                                  } as Paint),
                                ),
                            )
                            .sort((a, b) => a.name.localeCompare(b.name))
                        : []
                    }
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Color"
                        helperText={colorError}
                        error={!!colorError}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.name}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            mr: 4,
                            background:
                              option.color === ""
                                ? "linear-gradient(45deg, transparent 42%, red 42%, red 58%, transparent 58%)," +
                                  "linear-gradient(-45deg, transparent 42%, red 42%, red 58%, transparent 58%);"
                                : option.color === "transparent"
                                  ? "linear-gradient(45deg, #DDDDDD 0%, #333333 100%)"
                                  : option.color,
                            backgroundSize: "100% 100%",
                            border: (theme) =>
                              "1px solid " + theme.palette.text.primary,
                            boxShadow: 5,
                          }}
                        />
                        {option.name}
                      </li>
                    )}
                  />
                </>
              ) : (
                <>
                  <TextField
                    label="Brand name"
                    value={customBrand}
                    helperText={brandError}
                    error={!!brandError}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setCustomBrand(event.target.value);
                    }}
                  />
                  <TextField
                    id="add-paint-range"
                    label="Paint range"
                    value={range}
                    helperText={rangeError}
                    error={!!rangeError}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setRange(event.target.value);
                    }}
                  />
                  <Box display="flex" alignItems="center" gap={2} width="100%">
                    <TextField
                      label="Color name"
                      value={color?.name}
                      helperText={colorError}
                      error={!!colorError}
                      fullWidth
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setColor((prev) =>
                          !prev
                            ? { name: event.target.value, color: "" }
                            : { ...prev, name: event.target.value },
                        );
                      }}
                    />
                    <TextField
                      label="Color"
                      value={color?.color}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setColor((prev) =>
                          !prev
                            ? { name: "", color: event.target.value }
                            : { ...prev, color: event.target.value },
                        );
                      }}
                      sx={{ width: "10ch" }}
                      slotProps={{
                        htmlInput: {
                          type: "color",
                        },
                      }}
                    />
                  </Box>
                </>
              )}
            </Stack>
          </FormGroup>
          <Button type="submit" sx={{ display: "none" }} />
        </form>
        <Stack flexDirection={"row-reverse"}>
          <FormControlLabel
            sx={{}}
            control={
              <Checkbox
                checked={keepModalOpen}
                onChange={() => setKeepOpen(!keepModalOpen)}
              />
            }
            label={"Add another paint after this one"}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => closeModal()}>cancel</Button>
        <LoadingButton
          loading={loading}
          variant={"contained"}
          color={"primary"}
          startIcon={<Add />}
          onClick={(e) => submit(e)}
        >
          Add to collection
        </LoadingButton>
      </DialogActions>
    </>
  );
};
