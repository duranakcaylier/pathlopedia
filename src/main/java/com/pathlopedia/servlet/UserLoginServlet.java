package com.pathlopedia.servlet;

import com.google.code.morphia.Key;
import com.pathlopedia.ds.DatastorePortal;
import com.pathlopedia.ds.entity.User;
import com.pathlopedia.servlet.response.JSONResponse;
import com.pathlopedia.servlet.entity.UserLoginEntity;
import com.pathlopedia.servlet.response.WritableResponse;
import com.pathlopedia.servlet.base.PostMethodServlet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;

public final class UserLoginServlet extends PostMethodServlet {
    protected WritableResponse process(HttpServletRequest httpReq)
            throws IOException, ServletException {
        HttpSession ses = httpReq.getSession();

        // Fetch user.
        User user = DatastorePortal.safeGet(
                User.class, httpReq.getParameter("id"));

        // Check user visibility.
        if (!user.isVisible())
            return new JSONResponse(1, "Inactive user!");

        // Set appropriate session variables.
        ses.setAttribute("user", user);
        ses.setAttribute("userId", user.getId().toString());
        ses.setAttribute("userKey", new Key<User>(User.class, user.getId()));

        // Pack and return the result.
        return new JSONResponse(0,
                new UserLoginEntity(
                        user.getId().toString(),
                        user.getName()));
    }
}
