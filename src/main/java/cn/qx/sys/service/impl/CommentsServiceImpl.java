package cn.qx.sys.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;

import cn.qx.common.enums.ResultEnums;
import cn.qx.common.exception.ResultException;
import cn.qx.common.exception.ServiceException;
import cn.qx.common.vo.CommentsDTO;
import cn.qx.common.vo.PageBean;
import cn.qx.sys.entity.ArticleCategory;
import cn.qx.sys.entity.Comments;
import cn.qx.sys.mapper.SysCommentsMapper;
import cn.qx.sys.service.CommentsService;

/**
 * 
 * @author Satone
 * @date 2019年2月20日
 */
@Service
@SuppressWarnings("all")
@Transactional
public class CommentsServiceImpl implements CommentsService {

    @Autowired
    private SysCommentsMapper commentsMapper;

    @Override
    public Long findAllCount() {
        return commentsMapper.findAllCount();
    }

    @Override
    public List<Comments> findAll() {
        return commentsMapper.findAll();
    }

    @Override
    public PageBean findByPage(Comments comments, int pageCode, int pageSize) {
        PageHelper.startPage(pageCode, pageSize);
        Page page = commentsMapper.findByPage(comments);
        return new PageBean(page.getTotal(), page.getResult());
    }

    @Override
    public PageBean findCommentsList(int pageCode, int pageSize, int articleId, int sort) {
        PageHelper.startPage(pageCode, pageSize);

        Page<Comments> page = commentsMapper.findAllId(articleId, sort);

        List<Comments> list = commentsMapper.findCommentsList(articleId, sort);

        List<CommentsDTO> commentsDTOS = new ArrayList<CommentsDTO>();

        /**
         * 封装结果类型结构：
         *      [{{Comments-Parent}, [{Comments-Children}, {Comments-Children}...]}, {{}, [{}, {}, {}...]}]
         */
        for (Comments comments : list) {
            List<Comments> commentsList = new ArrayList<Comments>();
            if (comments.getpId() == 0 && comments.getcId() == 0) {
                //说明是顶层的文章留言信息
                for (Comments parent : list) {
                    if (parent.getpId() != 0) {
                        if (parent.getpId() == comments.getId()) {
                            //说明属于当前父节点
                            commentsList.add(parent);
                        }
                    }
                }
                commentsDTOS.add(new CommentsDTO(comments, commentsList));
            }
        }
        if (page.getTotal() < (pageCode * pageSize) - 1) {
            return new PageBean(page.getTotal(), commentsDTOS.subList((pageCode - 1) * pageSize, commentsDTOS.size()));
        } else {
            return new PageBean(page.getTotal(), commentsDTOS.subList((pageCode - 1) * pageSize, (pageCode * pageSize) - 1));
        }
    }

    @Override
    public Long findCountByArticle(long articleId) {
        return commentsMapper.findCountByArticleId(articleId);
    }

    @Override
    public Comments findById(long id) {
        return commentsMapper.findById(id);
    }

    @Override
    public void save(Comments comments) {
        try {
            commentsMapper.save(comments);
        } catch (Exception e) {
            e.printStackTrace();
            throw new ServiceException(e);
        }
    }

    @Override
    public void update(Comments comments) {
        try {
            commentsMapper.update(comments);
        } catch (Exception e) {
            e.printStackTrace();
            throw new ServiceException(e);
        }
    }

    @Override
    public void delete(Long... ids) {
        try {
            for (long id : ids) {
                commentsMapper.delete(id);
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new ServiceException(e);
        }
    }

	@Override
	public void deleteWithArticle(Long id) {
		try {
            commentsMapper.deleteWithArticle(id);
        } catch (Exception e) {
            e.printStackTrace();
            throw new ResultException(ResultEnums.INNER_ERROR);
        }
	}
    


}
