
import React from 'react';
import { renderToString } from 'react-dom/server';
import { JSDOM } from 'jsdom';

// Polyfill for standard browser features
const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost',
});
// Helper to safely set global properties
const setGlobal = (prop: string, value: any) => {
    try {
        (global as any)[prop] = value;
    } catch (e) {
        try {
            Object.defineProperty(global, prop, {
                value: value,
                writable: true,
                configurable: true
            });
        } catch (e2) {
            console.warn(`Failed to mock global property: ${prop}`);
        }
    }
};

setGlobal('window', dom.window);
setGlobal('document', dom.window.document);
setGlobal('navigator', dom.window.navigator);

// Patch global object to include window properties
Object.getOwnPropertyNames(dom.window).forEach((property) => {
    if (typeof (global as any)[property] === 'undefined') {
        setGlobal(property, (dom.window as any)[property]);
    }
});

// Mock matchMedia
global.window.matchMedia = global.window.matchMedia || function () {
    return {
        matches: false,
        addListener: function () { },
        removeListener: function () { }
    };
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

// Mock requestAnimationFrame
(global as any).requestAnimationFrame = (callback: any) => setTimeout(callback, 0);
(global as any).cancelAnimationFrame = (id: any) => clearTimeout(id);


// Import all components
import CoverPage from "../components/report/CoverPage";
import DocumentControl from "../components/report/DocumentControl";
import TableOfContents from "../components/report/TableOfContents";
import ExecutiveSummary from "../components/report/ExecutiveSummary";
import ScopeMethodology from "../components/report/ScopeMethodology";
import RiskDashboard from "../components/report/RiskDashboard";
import NetworkArchitecture from "../components/report/NetworkArchitecture";
import GeoThreatIntel from "../components/report/GeoThreatIntel";
import DetailedFindings from "../components/report/DetailedFindings";
import VulnTrending from "../components/report/VulnTrending";
import ComplianceMapping from "../components/report/ComplianceMapping";
import HostSummary from "../components/report/HostSummary";
import RemediationRoadmap from "../components/report/RemediationRoadmap";
import Appendices from "../components/report/Appendices";
import ComplianceDPDP from "../components/report/templates/ComplianceDPDP";
import ComplianceCERTIn from "../components/report/templates/ComplianceCERTIn";
import ComplianceBFSI from "../components/report/templates/ComplianceBFSI";
import BackCover from "../components/report/BackCover";
import Index from "../pages/Index";

const components = {
    Index,
    CoverPage,
    DocumentControl,
    TableOfContents,
    ExecutiveSummary,
    ScopeMethodology,
    RiskDashboard,
    NetworkArchitecture,
    GeoThreatIntel,
    DetailedFindings,
    VulnTrending,
    ComplianceMapping,
    HostSummary,
    RemediationRoadmap,
    Appendices,
    ComplianceDPDP,
    ComplianceCERTIn,
    ComplianceBFSI,
    BackCover
};

async function testRender() {
    console.log("Starting component render tests...");

    for (const [name, Component] of Object.entries(components)) {
        try {
            console.log(`Testing ${name}...`);
            renderToString(React.createElement(Component));
            console.log(`✅ ${name} passed.`);
        } catch (e) {
            console.error(`❌ ${name} FAILED:`);
            console.error(e);
        }
    }
    console.log("Finished tests.");
}

testRender();
