import {
  Autocomplete,
  DialogActions,
  DialogContent,
  FormGroup,
  FormHelperText,
  TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import { Add } from "@mui/icons-material";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { ExternalLink } from "@components/link/ExternalLink.tsx";
import { ChangeEvent, useState } from "react";
import allPaints from "@components/paints/data/paints.json";
import useTheme from "@mui/material/styles/useTheme";
import LoadingButton from "@mui/lab/LoadingButton";
import { Paint } from "@state/paints";
import { v4 } from "uuid";

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
  const [loading, setLoading] = useState(false);

  const [brand, setBrand] = useState<string | null>("");
  const [customBrand, setCustomBrand] = useState<string | null>("");
  const [range, setRange] = useState<string | null>(null);
  const [color, setColor] = useState<{ name: string; color: string } | null>(
    null,
  );

  const changeBrand = (newValue: string | null) => {
    setBrand(newValue);
    setRange(null);
    setColor({ name: "", color: theme.palette.primary.light });
  };
  const changeRange = (newValue: string | null) => {
    setRange(newValue);
    setColor(null);
  };

  const submit = () => {
    if (
      !(
        brand?.trim() &&
        range?.trim() &&
        color &&
        color.name?.trim() &&
        color.color?.trim() &&
        (brand !== customPaint || customBrand)
      )
    ) {
      console.log("Field not set...");
      return;
    }

    const newPaint: Paint =
      brand === customPaint
        ? {
            id: v4(),
            brand: customBrand!,
            color: color?.color,
            name: color?.name,
            range: range,
          }
        : {
            id: v4(),
            brand: brand,
            color: color?.color,
            name: color?.name,
            range: range,
          };

    console.log(newPaint);

    setLoading(true);
    setTimeout(() => {
      setBrand(null);
      setCustomBrand(null);
      setRange(null);
      setColor(null);
      setLoading(false);
    }, 1200);
  };

  const customPaint = "Custom paint";
  const supportedBrands = Object.keys(data);

  return (
    <>
      <DialogContent>
        <form>
          <FormGroup>
            <Stack direction={"column"} spacing={2}>
              <Box>
                <Autocomplete
                  value={brand}
                  onChange={(_, newValue: string | null) => {
                    changeBrand(newValue);
                  }}
                  id="add-paint-brand"
                  options={[...supportedBrands, customPaint]}
                  renderInput={(params) => (
                    <TextField {...params} label="Paint brand" />
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
                    options={brand ? Object.keys(data[brand]) : []}
                    renderInput={(params) => (
                      <TextField {...params} label="Paint range" />
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
                    options={brand && range ? data[brand][range] : []}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField {...params} label="Color" />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.name}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            mr: 4,
                            background:
                              option.color === "transparent"
                                ? "linear-gradient(210deg, white 0%, black 100%)"
                                : option.color,
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
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setCustomBrand(event.target.value);
                    }}
                  />
                  <TextField
                    label="Paint range"
                    value={range}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setRange(event.target.value);
                    }}
                  />
                  <Box display="flex" alignItems="center" gap={2} width="100%">
                    <TextField
                      label="Color name"
                      value={color?.name}
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
        </form>
      </DialogContent>
      <DialogActions>
        <Button>cancel</Button>
        <LoadingButton
          loading={loading}
          variant={"contained"}
          color={"primary"}
          startIcon={<Add />}
          onClick={() => submit()}
        >
          Add to collection
        </LoadingButton>
      </DialogActions>
    </>
  );
};
