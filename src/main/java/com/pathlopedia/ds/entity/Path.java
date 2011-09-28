package com.pathlopedia.ds.entity;

import com.google.code.morphia.Key;
import com.google.code.morphia.annotations.*;
import com.pathlopedia.ds.DatastoreException;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity("paths")
public class Path {
    @Id
    @SuppressWarnings("unused")
    private ObjectId id;

    @Reference(lazy=true)
    User user;

    private String title;
    private String text;
    private int score;
    @SuppressWarnings("unused")
    private List<Key<User>> scorers;
    private Date updatedAt;

    @Reference(lazy=true)
    List<Corner> corners;

    @Reference(lazy=true)
    List<Point> points;

    @Reference(lazy=true)
    List<Comment> comments;

    @Transient
    public final int MIN_TITLE_LENGTH = 1;

    @Transient
    public final int MAX_TITLE_LENGTH = 128;

    @SuppressWarnings("unused")
    private Path() {}

    public Path(User user, String title, String text) throws DatastoreException {
        this.user = user;
        this.title = title;
        this.text = text;
        this.score = 0;
        this.updatedAt = new Date();
        validate();
    }

    @PostLoad
    @PrePersist
    private void validate() throws DatastoreException {
        validateUser();
        validateTitle();
        validateScore();
        validateUpdatedAt();
    }

    @PostLoad
    @SuppressWarnings("unused")
    private void validateId() throws DatastoreException {
        if (this.id == null)
            throw new DatastoreException("NULL 'id' field!");
    }

    public ObjectId getId() {
        return this.id;
    }

    private void validateUser() throws DatastoreException {
        if (this.user == null)
            throw new DatastoreException("NULL 'user' field!");
    }

    public User getUser() {
        return this.user;
    }

    private void validateTitle() throws DatastoreException {
        if (this.title == null ||
                this.title.length() < MIN_TITLE_LENGTH ||
                this.title.length() > MAX_TITLE_LENGTH)
            throw new DatastoreException(
                    "'title' field ('"+this.title+"') must be between "+
                    MIN_TITLE_LENGTH+" and "+MAX_TITLE_LENGTH+" characters.");
    }

    public String getTitle() {
        return this.title;
    }

    public String getText() {
        return this.text;
    }

    private void validateScore() throws DatastoreException {
        if (this.score < 0)
            throw new DatastoreException("Negative 'score' field!");
    }

    public int getScore() {
        return this.score;
    }

    public List<Key<User>> getScorers() {
        if (this.scorers == null)
            return new ArrayList<Key<User>>();
        return this.scorers;
    }

    private void validateUpdatedAt() throws DatastoreException {
        if (this.updatedAt == null)
            throw new DatastoreException("NULL 'updatedAt' field!");
    }

    public Date getUpdatedAt() {
        return this.updatedAt;
    }

    public List<Corner> getCorners() {
        if (this.corners == null)
            return new ArrayList<Corner>();
        return this.corners;
    }

    public List<Point> getPoints() {
        if (this.points == null)
            return new ArrayList<Point>();
        return this.points;
    }

    public List<Comment> getComments() {
        if (this.comments == null)
            return new ArrayList<Comment>();
        return this.comments;
    }

    public boolean equals(Object that) {
        return (that instanceof Path && this.id.equals(((Path) that).id));
    }
}
