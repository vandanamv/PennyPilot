import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

export const PageMotion = ({ children, className = "" }) => {
  return <div className={className}>{children}</div>;
};

export const StaggerGroup = ({ children, className = "" }) => {
  return <div className={className}>{children}</div>;
};

export const RevealSection = ({ children, className = "" }) => {
  return <section className={className}>{children}</section>;
};

export const HoverCard = ({ children, className = "" }) => {
  return (
    <div
      className={cn(
        "group origin-center transition-[transform,box-shadow,border-color,background-color] duration-200 hover:-translate-y-1 hover:scale-[1.015] hover:shadow-[0_22px_55px_rgba(15,23,42,0.14)]",
        className
      )}
    >
      {children}
    </div>
  );
};

export const HoverItem = ({ children, className = "" }) => {
  return (
    <div
      className={cn(
        "group origin-center transition-[transform,box-shadow,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_14px_34px_rgba(15,23,42,0.1)]",
        className
      )}
    >
      {children}
    </div>
  );
};

PageMotion.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

StaggerGroup.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

RevealSection.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

HoverCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

HoverItem.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
