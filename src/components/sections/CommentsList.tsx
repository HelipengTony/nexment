import useComments from '../../lib/database/getCommentsList';
import React from 'react';
import Modal from '../modal';
import CommentsArea from '../../components/sections/CommentsArea';
import { nexmentConfigType } from '../container/index';
import '../../assets/style/commentslist.scss';
import { format } from 'timeago.js';
const md5 = require('js-md5');
import Icons from '../icons/index';
import MarkdownView from 'react-showdown';
import ContentLoader from 'react-content-loader';

const CommentsList = (Props: {
  type: string;
  pageKey: string;
  config: nexmentConfigType;
}) => {
  // Reusable data list
  const { commentsData, isLoading, isError } = useComments(
    Props.pageKey,
    Props.config
  );

  // Loading state
  const [loadingStatus, setLoadingStatus] = React.useState<boolean>(false);

  // Modal states
  const [modalVisibility, setModalVisibility] = React.useState<{
    [propsName: string]: boolean;
  }>({});

  // Comment state
  const [replyToID, setReplyToID] = React.useState<number>();
  const [replyToOID, setReplyToOID] = React.useState<string>();
  const [replyToName, setReplyToName] = React.useState<string>();
  const [commentsAreaRandom, setRandom] = React.useState<number>(Math.random());

  /**
   * Modal toggling function
   *
   * @param {commentsItemType[]} replies
   * @param {string} replyTo
   */
  const toggleModal = (repliesBelongOID: string) => {
    setModalVisibility((prevState: any) => {
      const nowState = { ...prevState };
      nowState[repliesBelongOID] = nowState[repliesBelongOID] ? false : true;
      return nowState;
    });
  };

  const adminBadge = (name: string, email: string) => {
    if (
      name === Props.config.admin.name &&
      email === Props.config.admin.email
    ) {
      return <div className="nexment-admin-badge">{Icons().admin}</div>;
    } else {
      return '';
    }
  };

  if (isLoading) {
    return (
      <div className="nexment-loading">
        <ContentLoader
          speed={2}
          width={100}
          style={{ width: '100%' }}
          height={124}
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
          <rect x="52" y="8" rx="3" ry="3" width="100%" height="10" />
          <rect x="52" y="30" rx="3" ry="3" width="80%" height="10" />
          <rect x="52" y="56" rx="3" ry="3" width="6" height="38" />
          <rect x="69" y="56" rx="3" ry="3" width="60%" height="6" />
          <rect x="69" y="72" rx="3" ry="3" width="50%" height="6" />
          <rect x="69" y="88" rx="3" ry="3" width="30%" height="6" />
          <circle cx="20" cy="24" r="20" />
        </ContentLoader>
      </div>
    );
  } else if (isError) {
    return (
      <div className="nexment-empty">
        <div>{Icons().commentsError}</div>
        <p>Nexment Service Error</p>
        <div className="nexment-error">
          <p>Problem Shooting</p>
          <p>
            Make sure you have created a Class named [nexment_comments] on
            LeanCloud&nbsp;|&nbsp;
            <a href="https://nexment.ouorz.com" target="_blank">
              Documentation
            </a>
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <CommentsArea
          pageKey={Props.pageKey}
          replyTo={replyToID}
          replyToOID={replyToOID}
          replyToName={replyToName}
          primaryReplyTo={undefined}
          primaryReplyToOID={undefined}
          primaryReplyToName={undefined}
          random={commentsAreaRandom}
          config={Props.config}
          reloadFunc={setLoadingStatus}
        />
        <div className="nexment-header">
          <div>
            <h1>{commentsData ? commentsData.length : 0} Comments</h1>
          </div>
          <div>
            <p>
              Powered by{' '}
              <a href="https://github.com/HelipengTony/nexment" target="_blank">
                Nexment
              </a>
            </p>
          </div>
        </div>
        <ul className="nexment-comments-list">
          {loadingStatus ? (
            <div className="nexment-loading-index">
              <ContentLoader
                speed={2}
                width={100}
                style={{ width: '100%' }}
                height={45}
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
              >
                <rect x="52" y="8" rx="3" ry="3" width="100%" height="10" />
                <rect x="52" y="30" rx="3" ry="3" width="80%" height="10" />
                <circle cx="20" cy="24" r="20" />
              </ContentLoader>
            </div>
          ) : (
            ''
          )}
        </ul>
        <ul className="nexment-comments-list">
          {commentsData !== undefined && commentsData.length ? (
            commentsData.map(item => (
              <li
                className="nexment-comments-list-item"
                key={item.ID}
                id={item.ID.toString()}
              >
                <div
                  className="nexment-comments-div"
                  onClick={() => {
                    setReplyToID(item.ID);
                    setReplyToOID(item.OID);
                    setReplyToName(item.name);
                    setRandom(Math.random());
                    window.location.href = '#nexment-comment-area';
                  }}
                >
                  <div className="nexment-comments-avatar">
                    <img
                      src={
                        'https://gravatar.loli.net/avatar/' + md5(item.email)
                      }
                    />
                    {adminBadge(item.name, item.email)}
                  </div>
                  <div className="nexment-comments-title">
                    <h5>
                      {item.name}
                      <span> · </span>
                      <b>{format(item.date)}</b>
                      <em className="nexment-reply-icon">{Icons().reply}</em>
                    </h5>
                    <p className="nexment-comments-des">{item.tag}</p>
                    <div
                      className={
                        'nexment-comments-content ' +
                        (item.tag ? '' : 'margin-top')
                      }
                    >
                      <MarkdownView
                        markdown={item.content}
                        options={{ tables: true, emoji: true }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <ul className="nexment-comments-reply-list">
                    {/* Replies should be ascend-sorted */}
                    {item.replyList.map(replyItem => (
                      <div
                        className="nexment-comments-list-item-div"
                        key={replyItem.ID}
                        id={replyItem.ID.toString()}
                      >
                        <li
                          className="nexment-comments-list-item"
                          onClick={() => {
                            if (replyItem.hasReplies) {
                              toggleModal(replyItem.OID);
                            } else {
                              setReplyToID(replyItem.ID);
                              setReplyToOID(replyItem.OID);
                              setReplyToName(replyItem.name);
                              setRandom(Math.random());
                              window.location.href = '#nexment-comment-area';
                            }
                          }}
                        >
                          <div className="nexment-comments-div">
                            <div className="nexment-comments-avatar">
                              <img
                                src={
                                  'https://gravatar.loli.net/avatar/' +
                                  md5(replyItem.email)
                                }
                              />
                              {adminBadge(replyItem.name, replyItem.email)}
                            </div>
                            <div className="nexment-comments-title">
                              <h5>
                                {replyItem.name}
                                <span> · </span>
                                <b>{format(replyItem.date)}</b>
                                {replyItem.hasReplies ? (
                                  <b className="nexment-comments-replyto">
                                    <span> · </span>
                                    {replyItem.replyList.length}{' '}
                                    {replyItem.replyList.length > 1
                                      ? 'replies'
                                      : 'reply'}
                                    {Icons().down}
                                  </b>
                                ) : (
                                  ''
                                )}
                                <em className="nexment-reply-icon-reply">
                                  {Icons().reply}
                                </em>
                              </h5>
                              <div className="nexment-comments-content margin-top-reply">
                                <MarkdownView
                                  markdown={replyItem.content}
                                  options={{ tables: true, emoji: true }}
                                />
                              </div>
                            </div>
                          </div>
                        </li>
                        <div>
                          {replyItem.hasReplies &&
                          modalVisibility[replyItem.OID] ? (
                            <Modal
                              key={replyItem.OID}
                              type="repliesList"
                              content={replyItem.replyList}
                              replyTo={replyItem.name}
                              replyToID={replyItem.ID}
                              replyToOID={replyItem.OID}
                              replyToName={replyItem.name}
                              pageKey={Props.pageKey}
                              visibilityFunction={toggleModal}
                              replyItem={replyItem}
                              config={Props.config}
                            />
                          ) : (
                            ''
                          )}
                        </div>
                      </div>
                    ))}
                  </ul>
                </div>
              </li>
            ))
          ) : (
            <div className="nexment-empty">
              <div>{Icons().comments}</div>
              <p>No Comments Yet</p>
            </div>
          )}
        </ul>
      </div>
    );
  }
};

export default CommentsList;