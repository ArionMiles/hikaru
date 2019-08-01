import React, { PropTypes }  from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dropdown, Grid, Header, Button, Container } from 'semantic-ui-react';
import * as projectActions from '../../actions/projectActions';
import ProjectList from './ProjectList';
import TagsSearch from './TagsSearch';
import { sortProjects } from './helpers';

const sortingOptions = [
  { text: 'Random', value: 'random' },
  { text: 'Newest Additions', value: 'created-des'},
  { text: 'Oldest Additions', value: 'created-asc'}
];

class ProjectsPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      projectList: sortProjects(this.props.projects, 'created-des'),
      tagSearchValue: [],
      sortValue: 'created-des'
    };

    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleTagClick = this.handleTagClick.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.projects.length > 0) {
      this.setState({ projectList: nextProps.projects });
    }
  }

  handleQueryChange(value) {
    // value is the list of searched tags
    const queryTagList = value;
    const projects = Object.assign([], this.props.projects);
    const { sortValue } = this.state;

    // Display all projects for empty query
    if (queryTagList.length == 0) {
      return this.setState({
        projectList: sortProjects(projects, sortValue),
        tagSearchValue: queryTagList
      });
    }

    let newProjectList = [];

    projects.map(project => {
      for (let i = 0; i < project.tags.length; i++) {
        let tag = project.tags[i];
        if (queryTagList.includes(tag)) {
          newProjectList.push(project);
          break;
        }
      }
    });

    this.setState({
      projectList: sortProjects(newProjectList, sortValue),
      tagSearchValue: queryTagList
    });
  }

  handleTagClick(event, button) {
    /* Add tag to search query if it doesn't already exist
     * Remove tag if it already exists.
     */
    event.preventDefault();
    const selectedTag = button.content;
    const { tagSearchValue } = this.state;
    let newTagSearchValue = [];

    tagSearchValue.map(tag => {
      if (tag != selectedTag) {
        newTagSearchValue.push(tag);
      }
    });

    if (newTagSearchValue.length == tagSearchValue.length) {
      /* Add selected tag */
      newTagSearchValue.push(selectedTag);
    }

    this.handleQueryChange(newTagSearchValue);
  }

  handleSortChange(event, { value }) {
    const projectList = sortProjects(this.state.projectList, value);

    this.setState({ projectList, sortValue: value });
  }

  render() {
    const { projectList, tagSearchValue } = this.state;
    const { tagSearchOptions } = this.props;

    return (
      <Container>
        <Header size="large" color="grey" content="Gallery" />
          <p>
            Want to submit your own project?&nbsp;
            <a href="https://github.com/ArionMiles/hikaru" style={{ cursor: "pointer" }}>Send a PR</a>.
          </p>

        <div className="margin-top-10">
          <Grid stackable>
            <Grid.Column width={10}>
              <TagsSearch
                options={tagSearchOptions}
                onQueryChange={this.handleQueryChange}
                value={tagSearchValue}
              />
            </Grid.Column>
            <Grid.Column width={6}>
              <Dropdown placeholder="Sort" selection fluid
                options={sortingOptions}
                onChange={this.handleSortChange}
                value={this.state.sortValue}
              />
            </Grid.Column>
          </Grid>
        </div>

        <ProjectList
          projects={projectList}
          onTagClick={this.handleTagClick}
        />
      </Container>
    );
  }
}

ProjectsPage.propTypes = {
  projectActions: PropTypes.object.isRequired,
  projects: PropTypes.array.isRequired,
  tagSearchOptions: PropTypes.array.isRequired
};

ProjectsPage.contextTypes = {
  router: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  let tagSearchOptions = [];
  state.tags.map(tag => {
    tagSearchOptions.push({ text: tag.name, value: tag.name });
  });

  return {
    projects: state.projects.projects,
    tagSearchOptions: tagSearchOptions
  };
}

function mapDispatchToProps(dispatch) {
  return {
    projectActions: bindActionCreators(projectActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsPage);
