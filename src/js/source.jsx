import React from "react";

import Folder from "./source/folder.jsx";
import View from "./source/view.jsx";
import Tree from "./source/model.js";

import zip from "jszip";
import util from "jszip-utils";

let Source = React.createClass({
    getInitialState: function() {
        return {
            loaded: false
        };
    },

    sourceTree: new Tree(),

    componentWillMount: function() {
        var component = this;

        if (component.sourceTree.hasFiles()) {
            component.setState({loaded: true});
            return;
        }

        component.sourceTree.setBaseDir(this.props.data.baseDir);
        util.getBinaryContent("/data/source.zip", function(error, data) {
            if (error) {
                console.log("Error", error);
                return;
            }

            var source = new zip(data);

            component.sourceTree.addFiles(source.files);
            component.setState({loaded: true});
        });
    },

    render: function() {
        var file = this.sourceTree.getFileName(this.props.parameters.splat || "/"),
            selected = file.split("/"),
            current = this.sourceTree.getSelectedFile(selected);

        selected.unshift("/");
        return (<div className="row">
            <div className="col-md-4">
                { !this.state.loaded ? (<h2>Loading source…</h2>) :
                <ul className="source-tree">
                    <Folder folder={this.sourceTree.getTree()} selected={selected} />
                </ul>
            }</div>
            <div className="col-md-8">
                {current ?
                    <View file={current} data={this.props.data} start={this.props.query.start} end={this.props.query.end} /> :
                    <h2>File not found</h2>
                }
            </div>
        </div>);
    }
});

export default Source; 
