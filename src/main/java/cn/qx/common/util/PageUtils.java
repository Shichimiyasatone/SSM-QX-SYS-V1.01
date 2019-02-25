package cn.qx.common.util;
import java.util.List;

import cn.qx.common.vo.PageObject;
public class PageUtils {
      /**
       * 当一个泛型参数应用在了方法的返回值类型
       * 左侧时这样的方法称之为泛型方法.
       * @param rowCount
       * @param records
       * @param pageSize
       * @param pageCurrent
       * @return
       */
	  public static <T>PageObject<T> newPageObject(
			  Integer rowCount,
			  Integer pageSize,
			  Integer pageCurrent,
	           List<T> records){
		    PageObject<T> po=new PageObject<>();
			po.setRowCount(rowCount);
			po.setRecords(records);
			po.setPageSize(pageSize);
			po.setPageCurrent(pageCurrent);
			po.setPageCount((rowCount-1)/pageSize+1);
			return po;
	  }
}
