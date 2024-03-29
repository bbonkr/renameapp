import React, { useState, useEffect } from 'react';
import { types, ReplaceTypeKey } from '../../../models/replaceType';
import {
    Box,
    Paper,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    TextField,
    SelectChangeEvent,
} from '@mui/material';
import { FormData } from './FormData';

import './RenameTool.css';

interface RenameToolProps {
    onChange?: (_formData: FormData) => void;
}

export const RenameTool = ({ onChange }: RenameToolProps) => {
    const [formData, setFormData] = useState<FormData>({
        type: '1',
        lookup: '',
        value: '',
    });

    const handleReplaceTypeChanged = (
        event: SelectChangeEvent<ReplaceTypeKey>,
    ) => {
        const selectedValue = event.target.value as ReplaceTypeKey;

        setFormData(prevState => {
            if (!formData || formData.type !== selectedValue) {
                return {
                    type: selectedValue,
                    lookup: '',
                    value: '',
                };
            } else {
                return {
                    ...prevState,
                };
            }
        });
    };

    const handleTextFieldChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const value = event.target.value;
        const name = event.target.name;

        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (onChange) {
            onChange(formData);
        }
    }, [formData]);

    return (
        <Paper className={'content-container'}>
            <form
                className={'form-container'}
                noValidate={true}
                autoComplete="off"
            >
                <FormControl
                    className={'form-control '}
                    style={{ minWidth: '150px' }}
                >
                    <InputLabel id="selectOperationType">Type</InputLabel>
                    <Select
                        labelId="selectOperationType"
                        variant="standard"
                        id="demo-simple-select"
                        value={formData.type}
                        onChange={handleReplaceTypeChanged}
                        margin="none"
                    >
                        {types.map(v => {
                            return (
                                <MenuItem key={v.key} value={v.key}>
                                    {v.value}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>

                <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="baseline"
                    justifyContent="stretch"
                    style={{ flex: 1, marginLeft: '0.6rem' }}
                >
                    {formData.type === '2' || formData.type === '3' ? (
                        <FormControl
                            className={'form-control'}
                            style={{ flex: 1 }}
                        >
                            <TextField
                                label="추가할 문자열"
                                id="append-text-input"
                                name="value"
                                value={formData.value}
                                onChange={handleTextFieldChange}
                                className={'text-field'}
                                margin="none"
                                variant="standard"
                                fullWidth
                                helperText={`입력된 문자열이 ${
                                    formData.type === '2' ? '앞' : '뒤'
                                }에 추가됩니다.`}
                            />
                        </FormControl>
                    ) : null}

                    {formData.type === '1' ? (
                        <>
                            <FormControl
                                className={'form-control'}
                                style={{ flex: 1, marginRight: '0.6rem' }}
                            >
                                <TextField
                                    label="찾는 문자열"
                                    id="lookup-text-input"
                                    name="lookup"
                                    value={formData.lookup}
                                    onChange={handleTextFieldChange}
                                    className={'text-field'}
                                    placeholder="찾는 문자열"
                                    margin="none"
                                    variant="standard"
                                    fullWidth
                                    helperText="변경하기 위해 찾을 문자열"
                                />
                            </FormControl>
                            <FormControl
                                className={'form-control'}
                                style={{ flex: 1 }}
                            >
                                <TextField
                                    label="변경할 문자열"
                                    id="replace-text-input"
                                    name="value"
                                    value={formData.value}
                                    onChange={handleTextFieldChange}
                                    className={'text-field'}
                                    placeholder="변경할 문자열"
                                    aria-describedby="replace-text-input-helper"
                                    margin="none"
                                    variant="standard"
                                    helperText="첫번째 발견된 문자열만 변경됩니다."
                                    fullWidth
                                />
                            </FormControl>
                        </>
                    ) : null}
                    {formData.type === '4' ? (
                        <>
                            <FormControl
                                className={'form-control'}
                                style={{ flex: 1, marginRight: '0.6rem' }}
                            >
                                <TextField
                                    label="찾는 정규식"
                                    id="lookup-regexp-input-text"
                                    name="lookup"
                                    value={formData.lookup}
                                    onChange={handleTextFieldChange}
                                    className={'text-field'}
                                    margin="none"
                                    variant="standard"
                                    placeholder="정규식"
                                    aria-describedby="lookup-regexp-input-help-text"
                                    InputProps={{
                                        startAdornment: <span>/</span>,
                                        endAdornment: <span>/gi</span>,
                                    }}
                                    helperText="발견된 모든 문자열이 변경됩니다."
                                    fullWidth
                                />
                            </FormControl>
                            <FormControl
                                className={'form-control'}
                                style={{ flex: 1 }}
                            >
                                <TextField
                                    label="변경할 문자열"
                                    id="replace-reg-exp-text-input"
                                    name="value"
                                    value={formData.value}
                                    onChange={handleTextFieldChange}
                                    margin="none"
                                    variant="standard"
                                    className={'text-field'}
                                    fullWidth
                                    helperText=""
                                />
                            </FormControl>
                        </>
                    ) : null}
                </Box>
            </form>
        </Paper>
    );
};
