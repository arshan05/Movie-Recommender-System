import React from 'react'
import Autocomplete from 'react-autocomplete'

const AutoComplete = ({ movieName, movies, setMovieName }) => {
    return (
        <Autocomplete
            value={movieName}
            items={movies}
            getItemValue={(item) => item}
            renderItem={(item, isHighlighted) => (
                <div
                    className={`item ${isHighlighted ? "selected-item" : ""}`}
                >
                    {item}
                </div>
            )}
            onChange={(event) => setMovieName(event.target.value)}
            onSelect={(value) => setMovieName(value)}
            shouldItemRender={(item, value) => item.toLowerCase().indexOf(value.toLowerCase()) > -1}
            inputProps={{
                style: {
                    width: "450px",
                    height: "48px",
                    padding: "0 10px",
                    border: "2px solid var(--input-border-color)",
                    borderRadius: "6px",
                    fontSize: "14px",
                    background: "transparent",
                    color: "var(--text-color)",
                    outline: "none",
                },
                placeholder: "Enter Movie Name",
            }}
            renderMenu={children => (
                <div className="menu" style={{
                    width: '473px',
                    maxHeight: "300px",
                    position: 'absolute',
                    color: 'var(--text-color)',
                    backgroundColor: 'var(--menu-bg)',
                    overflow: 'auto',
                    top: '145px',
                    left: '0',
                }}>
                    {children.slice(0, 100)}
                </div>
            )}
        />
    )
}

export default AutoComplete
