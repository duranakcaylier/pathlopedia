package com.pathlopedia.servlet;

import com.pathlopedia.datastore.DatastorePortal;
import com.pathlopedia.datastore.entity.*;
import com.pathlopedia.servlet.base.PostMethodServlet;
import com.pathlopedia.servlet.response.JSONResponse;
import com.pathlopedia.servlet.response.WritableResponse;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Date;

public final class PathPointAddServlet extends PostMethodServlet {
    protected WritableResponse process(HttpServletRequest req)
            throws IOException, ServletException {
        requireLogin();

        // Fetch the path.
        Path path = DatastorePortal.safeGet(
                Path.class, getTrimmedParameter("path"));

        // Check path visibility.
        if (!path.isVisible())
            throw new ServletException("Inactive path!");

        // Check path accessibility.
        if (!path.isEditable(getSessionUser()))
            throw new ServletException("Access denied!");

        // Fetch the point.
        Point point = DatastorePortal.safeGet(
                Point.class, getTrimmedParameter("point"));

        // Check point visibility.
        if (!point.isVisible())
            throw new ServletException("Inactive point!");

        // Check point accessibility.
        if (!point.isEditable(getSessionUser()))
            throw new ServletException("Access denied!");

        // Check if the point is already included.
        if (path.getPoints().contains(point))
            return new JSONResponse(0);

        // Pay attention that point can already be associated with some other
        // path. Nonetheless, we allow its owner to re-associate it with
        // another path.

        // As another side note, we don't check whether the point overlaps
        // with a corner or not. User is free to 1) place any point on the map,
        // and 2) associate it with any path he/she deserves.

        // Update the point.
        Parent parent = new Parent(path);
        DatastorePortal.safeUpdate(point,
                DatastorePortal.getDatastore()
                        .createUpdateOperations(Point.class)
                        .set("updatedAt", new Date())
                        .set("parent", parent));

        // Update the path.
        DatastorePortal.safeUpdate(path,
                DatastorePortal.getDatastore()
                        .createUpdateOperations(Path.class)
                        .set("updatedAt", new Date())
                        .add("points", point));

        // Return success.
        return new JSONResponse(0);
    }
}
