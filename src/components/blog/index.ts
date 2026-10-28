import Callout from "./Callout";
import StatGrid from "./StatGrid";
import BarChart from "./BarChart";
import RatioBar from "./RatioBar";
import DataTable from "./DataTable";
import FlowDiagram from "./FlowDiagram";

/**
 * 博客 MDX 组件的唯一入口。
 *
 * 文章里统一从 `../../components/blog` 导入，不要直接引用子目录文件。
 * 新增组件时：在这里导出、登记到 blogComponentCatalog，并更新 README。
 */
export { Callout, StatGrid, BarChart, RatioBar, DataTable, FlowDiagram };

export const blogMdxComponents = {
  Callout,
  StatGrid,
  BarChart,
  RatioBar,
  DataTable,
  FlowDiagram,
};

export type BlogComponentCatalogItem = {
  name: keyof typeof blogMdxComponents;
  summary: string;
  props: string;
  since: string;
};

export const blogComponentCatalog: BlogComponentCatalogItem[] = [
  {
    name: "Callout",
    summary: "带语义色的提示块，用于说明、结论和边界提醒",
    props: "tone?: note | insight | warning; title?: string",
    since: "2026-10",
  },
  {
    name: "StatGrid",
    summary: "2–4 列的关键数字卡片组",
    props: "items: { value, label, note? }[]; caption?: string",
    since: "2026-10",
  },
  {
    name: "BarChart",
    summary: "横向条形图，适合少量类别对比",
    props:
      "data: { label, value, note? }[]; unit?: string; total?: number; caption?: string",
    since: "2026-10",
  },
  {
    name: "RatioBar",
    summary: "单行占比条，用于构成或比例展示",
    props: "segments: { label, value, tone? }[]; caption?: string",
    since: "2026-10",
  },
  {
    name: "DataTable",
    summary: "响应式数据表，窄屏可横向滚动",
    props:
      "columns: string[]; rows: (string | number)[][]; caption?: string; numericColumns?: number[]; nowrapColumns?: number[]",
    since: "2026-10",
  },
  {
    name: "FlowDiagram",
    summary: "纵向流程/分层图，用编号卡片与箭头展示调用链",
    props:
      "nodes: { title, detail?, tag?, tone? }[]; caption?: string",
    since: "2026-10",
  },
];
