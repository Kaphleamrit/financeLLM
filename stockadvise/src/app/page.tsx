"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  Typography,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  TextField,
  Toolbar,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

interface StockSuggestion {
  ticker: string;
  company_name: string;
  explanation: string;
}

interface Stock {
  id: string;
  cik_str: number;
  ticker: string;
  title: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);

  // Chat with Finance Expert
  const [chatResponse, setChatResponse] = useState<string>("");
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [chatQuery, setChatQuery] = useState<string>("");

  // Stock Suggestions
  const [suggestions, setSuggestions] = useState<StockSuggestion[]>([]);
  const [suggestionLoading, setSuggestionLoading] = useState<boolean>(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);

  // Current Stocks
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [stocksLoading, setStocksLoading] = useState<boolean>(false);
  const [stocksError, setStocksError] = useState<string | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleChatSubmit = async () => {
    setChatLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: chatQuery }),
      });
      const data = await response.json();
      setChatResponse(data.response);
    } catch (error) {
      console.error("Error fetching chat response:", error);
      setChatResponse("Failed to fetch response.");
    } finally {
      setChatLoading(false);
    }
  };

  const handleGetSuggestions = async () => {
    setSuggestionLoading(true);
    setSuggestionError(null);
    try {
      const response = await fetch(`http://127.0.0.1:8000/suggestions`, {
        method: "GET",
      });
      const data = await response.json();
      if (data.related_companies && Array.isArray(data.related_companies)) {
        setSuggestions(data.related_companies);
      } else {
        setSuggestionError("Invalid response format from the server.");
      }
    } catch (error) {
      console.error("Error fetching stock suggestions:", error);
      setSuggestionError("Failed to fetch suggestions.");
    } finally {
      setSuggestionLoading(false);
    }
  };

  const fetchStocks = async () => {
    setStocksLoading(true);
    setStocksError(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/tickers");
      const data = await response.json();

      // Transform the response into the required format
      const formattedStocks = Object.entries(data.tickers).map(([id, stock]) => ({
        id, // Use the key as the ID
        ...stock,
      }));

      setStocks(formattedStocks);
    } catch (error) {
      console.error("Error fetching stocks:", error);
      setStocksError("Failed to fetch stocks.");
    } finally {
      setStocksLoading(false);
    }
  };

  // Fetch stocks when the "Current Stocks" tab is active
  useEffect(() => {
    if (activeTab === 2) {
      fetchStocks();
    }
  }, [activeTab]);

  return (
    <div>
      {/* Common Navbar */}
      <AppBar position="static" style={{ backgroundColor: "#1976d2" }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Financial Assistant
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Tabs */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Chat with Finance Expert" />
          <Tab label="Stock Suggestions" />
          <Tab label="Current Stocks" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box padding={3} margin="auto" maxWidth="800px">
        {activeTab === 0 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Chat with Finance Expert
            </Typography>
            <Typography variant="body1" style={{ marginBottom: "20px" }}>
              Use this feature to ask any finance-related questions. Our AI-powered finance expert will provide tailored answers to your queries.
            </Typography>
            <TextField
              fullWidth
              label="Ask a question"
              variant="outlined"
              value={chatQuery}
              onChange={(e) => setChatQuery(e.target.value)}
              style={{ marginBottom: "20px" }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleChatSubmit}
              disabled={chatLoading}
            >
              {chatLoading ? "Sending..." : "Ask"}
            </Button>
            {chatLoading && <CircularProgress style={{ marginLeft: "20px" }} />}
            {chatResponse && (
              <Box marginTop={2}>
                <Typography variant="h6">Response:</Typography>
                <ReactMarkdown>{chatResponse}</ReactMarkdown>
              </Box>
            )}
          </Box>
        )}
        {activeTab === 1 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Stock Suggestions
            </Typography>
            <Typography variant="body1" style={{ marginBottom: "20px" }}>
              Get recommendations on which stocks to buy based on the latest financial trends and market analysis.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGetSuggestions}
              disabled={suggestionLoading}
            >
              {suggestionLoading ? "Fetching..." : "Get Stock Suggestions"}
            </Button>
            {suggestionLoading && <CircularProgress style={{ marginLeft: "20px" }} />}
            {suggestionError && (
              <Typography color="error" style={{ marginTop: "20px" }}>
                {suggestionError}
              </Typography>
            )}
            <Grid container spacing={3} style={{ marginTop: "20px" }}>
              {suggestions.map((suggestion) => (
                <Grid item xs={12} sm={6} md={4} key={suggestion.ticker}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="primary">
                        {suggestion.company_name} ({suggestion.ticker})
                      </Typography>
                      <Typography>{suggestion.explanation}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        {activeTab === 2 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Current Stocks
            </Typography>
            <Typography variant="body1" style={{ marginBottom: "20px" }}>
              Explore current stock data, including company name, ticker, and CIK number.
            </Typography>

            {stocksLoading ? (
              <CircularProgress style={{ display: "block", margin: "20px auto" }} />
            ) : stocksError ? (
              <Typography color="error" style={{ marginTop: "20px", textAlign: "center" }}>
                {stocksError}
              </Typography>
            ) : (
              <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={stocks}
                  columns={[
                    { field: "ticker", headerName: "Ticker", width: 100 },
                    { field: "title", headerName: "Company Name", width: 250 },
                    { field: "cik_str", headerName: "CIK Number", width: 150 },
                  ]}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                />
              </div>
            )}
          </Box>
        )}
      </Box>
    </div>
  );
}
