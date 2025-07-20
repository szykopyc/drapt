import React, { useState } from "react";
import { flagMapperDict } from "../../helperfunctions/FlagMapper";
import { getAssetMetadataFuzzy } from "../../lib/AssetDataService";
import { FaSearch } from "react-icons/fa";
import { MdOutlineClose, MdInfoOutline, MdErrorOutline } from "react-icons/md";
import { LoadingSpinner } from "../helperui/LoadingSpinnerHelper";

// code explanation because it'll be very easy to get lost in this in the future
// this component is designed to be the child of a parent component. it acts as a search bar for getting some asset metadata using the /asset-data/fuzzy-search route
// the reason why im using fuzzy here is because if someone doesn't know the name of their ticker, but they do know which company they're thinking of, you can just select it

// the actual explanation starts here

export default function FuzzyAssetMetadataSearchBar({
    selectedAsset, // passed down from parent,
    onSelect, // called up to parent
    disabled, // passed down from parent
    ref, // prop
}) {
    const [searchTerm, setSearchTerm] = useState(""); // what the user types in
    const [isLoading, setIsLoading] = useState(false); // loading duh
    const [isError, setIsError] = useState(null); // for if there was a user on asset search
    const [showDropdown, setShowDropdown] = useState(false); // sets if dropdown should show
    const [queriedAssetMetadata, setQueriedAssetMetadata] = useState([]); // result/s for dropdown

    // Expose clear input function via ref if provided
    if (ref) {
        ref.current = {
            clear: () => setSearchTerm(""),
        };
    }

    // handles searching for asset metadata based on searchTerm input
    const handleAssetSearch = async () => {
        if (!searchTerm || searchTerm === "") return;

        setIsLoading(true);
        try {
            // Call API to get fuzzy-matched asset metadata for the search term
            const response = await getAssetMetadataFuzzy(searchTerm);
            await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay for UX
            setQueriedAssetMetadata(response); // Store results for dropdown
        } catch (error) {
            // Handle errors and show toast
            setIsError(error?.response?.data?.detail);
            toast.error(
                `Failed to find assets with the search term ${searchTerm}`
            );
        } finally {
            setIsLoading(false);
            setShowDropdown(true); // Show dropdown with results
        }
    };
    return (
        <div className="relative w-full">
            <div className="flex items-center">
                <input
                    type="text"
                    className={`input focus:outline-none w-full border-base-300 ${
                        selectedAsset.ticker ? "font-semibold text-info" : ""
                    }`}
                    placeholder="Search ticker..."
                    // If a ticker is selected, show it (with flag, ticker, company name), otherwise show search term
                    value={
                        selectedAsset.ticker
                            ? `${selectedAsset.ticker} — ${selectedAsset.company_name}`
                            : searchTerm || ""
                    }
                    // When user types, clear selection and dropdown, and update search term
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        onSelect({});
                        setShowDropdown(false);
                    }}
                    disabled={disabled}
                />
                {showDropdown ? (
                    // If dropdown is open, show a close (X) button to clear search and selection
                    <button
                        className="btn btn-info rounded-none shadow-none flex justify-center items-center"
                        type="button"
                        onClick={() => {
                            setShowDropdown(false);
                            setQueriedAssetMetadata([]);
                            setIsError(null);
                            setSearchTerm("");
                            onSelect({});
                        }}
                        disabled={isLoading || disabled}
                    >
                        <MdOutlineClose className="text-white" />
                    </button>
                ) : (
                    // If dropdown is closed, show search button to trigger asset search
                    <button
                        className="btn btn-info rounded-none shadow-none flex justify-center items-center"
                        type="button"
                        onClick={handleAssetSearch}
                        disabled={isLoading || disabled}
                    >
                        <FaSearch className="text-white" />
                    </button>
                )}
            </div>
            {/* Dropdown with search results appears below input when showDropdown is true */}
            {showDropdown && queriedAssetMetadata && (
                <ul className="absolute z-10 w-full dropdown-content bg-base-100 border-base-300 border-t-0 border-x-1 border-b-1 shadow input-bordered max-h-[300px] overflow-y-auto">
                    {queriedAssetMetadata.map((asset) => (
                        <li
                            key={asset.ticker}
                            className="w-full border-b-1 border-base-300 py-3 px-3 hover:bg-info/30"
                        >
                            <button
                                className="w-full text-left"
                                // When an asset is clicked, set it as the selected ticker, update input, and close dropdown
                                onClick={() => {
                                    onSelect(asset); // Pass selected asset up to parent
                                    setSearchTerm(asset.ticker);
                                    setShowDropdown(false);
                                }}
                            >
                                <div className="flex flex-col justify-between px-0">
                                    <span className="font-bold">
                                        {asset.ticker}
                                    </span>
                                    <span>
                                        {asset.company_name.length < 26
                                            ? asset.company_name
                                            : asset.company_name.slice(0, 26) +
                                              "..."}
                                    </span>
                                    <span>{asset.type}</span>
                                    <span>
                                        {asset.exchange}{" "}
                                        {flagMapperDict[asset.countryCode]}
                                    </span>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            {showDropdown && queriedAssetMetadata.length === 0 && !isError && (
                <div className="absolute z-10 w-full dropdown-content bg-base-100 border-base-300 border-t-0 border-x-1 border-b-1 shadow py-6">
                    <div className="flex justify-center items-center gap-3">
                        <MdInfoOutline className="text-2xl text-info" />
                        <span className="text-info text-sm">
                            No results found, try a different search query
                        </span>
                    </div>
                </div>
            )}
            {/* Show loading spinner while searching */}
            {isLoading && (
                <div className="absolute z-10 w-full dropdown-content bg-base-100 border-base-300 border-t-0 border-x-1 border-b-1 shadow">
                    <div className="flex justify-center items-center gap-3">
                        <LoadingSpinner />
                        <span className="text-sm">Searching...</span>
                    </div>
                </div>
            )}
            {/* Show error if search fails */}
            {isError && (
                <div className="absolute z-10 w-full dropdown-content bg-base-100 border-base-300 border-t-0 border-x-1 border-b-1 shadow py-6 ">
                    <div className="flex justify-center items-center gap-3">
                        <MdErrorOutline className="text-2xl text-error" />
                        {isError?.message || "Error searching tickers"}
                    </div>
                </div>
            )}
        </div>
    );
}
